module.exports = sourcePlugin

function sourcePlugin (babel) {
  const { types: t, transformFromAst } = babel

  return {
    name: 'source',
    visitor: {
      Expression (path) {
        const { node } = path

        const { leading, trailing } = getSourceNameCommentsFromNode(node)
        if (!leading.length && !trailing.length) {
          return
        }

        const firstLeading = leading[0]

        const ast = t.file(t.program([t.expressionStatement(removeSourceCommentsFromNode(node))]))
        const { code: sourceString } = transformFromAst(ast)
        const variablePath = path.find(path => path.scope.bindings[firstLeading.name])
        if (!variablePath || !variablePath.scope) {
          return
        }
        variablePath.scope.bindings[firstLeading.name].path.node.init = t.stringLiteral(
          sourceString
        )
      },
      Scopable (path) {
        const { body } = path.node

        const sources = {}

        const handleComment = comment => {
          // Don't handle duplicate comments
          if (sources[comment.name] && sources[comment.name].open === comment.node) {
            return
          }
          // If the source is open, close it
          if (sources[comment.name] && sources[comment.name].open !== comment.node) {
            sources[comment.name].open = false
          } else {
            // Otherwise, create or use the same one
            sources[comment.name] = sources[comment.name] || {
              nodes: [],
            }
            // And open it up
            sources[comment.name].open = comment.node
          }
        }

        if (body.length) {
          body.forEach(node => {
            const { leading, trailing } = getSourceNameCommentsFromNode(node)

            leading.forEach(handleComment)

            Object.values(sources).forEach(source => {
              if (source.open) {
                source.nodes.push(removeSourceCommentsFromNode(node))
              }
            })

            trailing.forEach(handleComment)
          })
        }

        Object.keys(sources).forEach(sourceName => {
          const ast = t.file(t.program(sources[sourceName].nodes))
          const { code: sourceString } = transformFromAst(ast)
          const variablePath = path.find(path => path.scope.bindings[sourceName])
          if (!variablePath || !variablePath.scope) {
            return
          }
          variablePath.scope.bindings[sourceName].path.node.init = t.stringLiteral(sourceString)
        })
      },
    },
  }
}

function isSourceComment (comment) {
  const normalizedComment = comment.value.trim().split(' ')
  if (normalizedComment.length !== 2) {
    return
  }
  const isSource = normalizedComment[0].trim() === '@source'
  let hasName = normalizedComment[1]
  hasName = hasName && normalizedComment[1].trim()

  return isSource && hasName ? { name: hasName, node: comment } : false
}

function getSourceNameCommentsFromNode (node) {
  const { leadingComments, trailingComments } = node
  return {
    leading: (leadingComments || []).map(isSourceComment).filter(Boolean),
    trailing: (trailingComments || []).map(isSourceComment).filter(Boolean),
  }
}

function removeSourceCommentsFromNode (node) {
  return {
    ...node,
    leadingComments: node.leadingComments
      ? node.leadingComments.filter(d => !isSourceComment(d))
      : node.leadingComments,
    trailingComments: node.trailingComments
      ? node.trailingComments.filter(d => !isSourceComment(d))
      : node.trailingComments,
  }
}

/*
eslint
  import/no-unassigned-import:0
  import/no-dynamic-require:0
*/

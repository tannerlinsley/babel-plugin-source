module.exports = sourcePlugin

function sourcePlugin (babel) {
  const { types: t } = babel

  return {
    name: 'source',
    visitor: {
      Expression (path) {
        const { node } = path

        const { leading, trailing } = getSourceNameCommentsFromNode(node)
        if (node.__sourceHandled || (!leading.length && !trailing.length)) {
          return
        }

        node.__sourceHandled = true
        const lastLeading = leading[leading.length - 1]
        const firstTrailing = trailing[trailing.length - 1]
        const sourceName = lastLeading.name

        const sourceCode = makeSourceCode(this.file.code, lastLeading.node, firstTrailing.node)

        const variablePath = path.find(path => path.scope.bindings[sourceName])
        if (!variablePath || !variablePath.scope) {
          throw path.buildCodeFrameError(
            `Couldn't find the 'let/var ${sourceName}' variable for @source ${sourceName}!`
          )
        }
        variablePath.scope.bindings[sourceName].path.node.init = t.stringLiteral(sourceCode)
        removeSourceCommentsFromNode(node)
      },
      Scopable (path) {
        // Don't handle nodes twice
        if (path.node.__sourceHandled) {
          return
        }
        path.node.__sourceHandled = true

        const { body } = path.node

        const sources = {}

        const handleComment = comment => {
          if (sources[comment.name]) {
            // Don't handle duplicates
            if (sources[comment.name].start === comment.node) {
              return
            }
            // Don't handle closed sources
            if (sources[comment.name].end) {
              return
            }
            // Close source
            sources[comment.name].end = comment.node
          } else {
            // Otherwise, open it up
            sources[comment.name] = {
              start: comment.node,
            }
          }
        }

        if (body.length) {
          body.forEach(node => {
            const { leading, trailing } = getSourceNameCommentsFromNode(node);
            [...leading, ...trailing].forEach(handleComment)
          })
        }

        Object.keys(sources).forEach(sourceName => {
          const source = sources[sourceName]
          const sourceCode = makeSourceCode(this.file.code, source.start, source.end)
          const variablePath = path.find(path => path.scope.bindings[sourceName])
          if (!variablePath || !variablePath.scope) {
            throw path.buildCodeFrameError(
              `Couldn't find the 'let/var ${sourceName}' variable for @source ${sourceName}!`
            )
          }
          variablePath.scope.bindings[sourceName].path.node.init = t.stringLiteral(sourceCode)
          removeSourceCommentsFromNode(source.start)
          removeSourceCommentsFromNode(source.end)
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
  node.leadingComments = node.leadingComments
    ? node.leadingComments.filter(d => !isSourceComment(d))
    : node.leadingComments
  node.trailingComments = node.trailingComments
    ? node.trailingComments.filter(d => !isSourceComment(d))
    : node.trailingComments
  return node
}

function makeSourceCode (source, startComment, endComment) {
  const startLine = startComment.loc.end.line
  const endLine = endComment.loc.start.line
  const startColumn = startComment.loc.end.column
  const endColumn = endComment.loc.start.column
  const isSingleLine = startLine === endLine

  let sourceLines = source.split('\n').slice(startLine - 1, isSingleLine ? startLine : endLine)

  sourceLines[0] = sourceLines[0].slice(startColumn)
  sourceLines[sourceLines.length - 1] = sourceLines[sourceLines.length - 1].slice(
    0,
    isSingleLine ? endColumn - startColumn : endColumn
  )
  sourceLines = sourceLines.filter(d => d.length)
  const shortestIndentation = sourceLines.reduce((acc, next) => {
    let length = 0
    while (next.charAt(length) === ' ') {
      length += 1
    }
    return acc < length ? acc : length
  }, Infinity)
  sourceLines = sourceLines.filter(d => d.replace(/[ ]*/, ''))
  return sourceLines.map(d => d.substring(shortestIndentation)).join('\n')
}

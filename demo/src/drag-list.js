import { css } from '@emotion/react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Box from './checkbox'

// Adapted from https://codesandbox.io/s/4qp6vjp319?from-embed

const indent = css`
  margin: 0;
  padding: 0;
  list-style: none;
`

const check = css`
  margin-left: 24px;
  margin-right: 8px;
`

const iconSize = css`
  display: inline-flex;
  min-width: 56px;
  flex-shrink: 0;
`

const background = css`
  color: #fff;
  max-width: 350px;
`

const align = css`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 8px;
`

const dragable = css`
  div {
    cursor: grab !important;
  }
`

const normal = css`
  div {
    cursor: auto !important;
  }
`

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const getItemStyle = (isDragging, draggableStyle) => ({
  listStyle: 'none',
  ...draggableStyle,
  ...(isDragging && {
    background: "#313131"
  })
})

const DragList = p => {
  const onDragEnd = (result) => {
    if (!result.destination) return
    p.setItems(items => {
      return reorder(
        items,
        result.source.index,
        result.destination.index
      )
    })
  }
  const toggle = index => {
    p.setItems(items => {
      let [removed] = items.splice(index, 1)
      removed.enabled = !removed.enabled
      items.splice(index, 0, removed)
      return items.concat([])
    })
  }
  return (
    <form css={background}>
      <fieldset>
        <legend>{p.children}</legend>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div ref={provided.innerRef}>
                <ul css={indent}>
                  {p.items.map((pair, index) => {
                    const { name, Button } = pair
                    const id = `icon-${name}`
                    const label = name.toLowerCase()
                    const icon = <span css={p.disabled ? normal : dragable}><Button selected={pair.enabled} disabled={true} /></span>
                    return (
                      <Draggable key={id} isDragDisabled={p.disabled} draggableId={id} index={index}>
                        {(provided, snapshot) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <div css={align}>
                              <Box id={label} disabled={p.disabled} css={check} checked={pair.enabled} onChange={() => toggle(index)} />
                              <div css={iconSize} aria-hidden="true">{icon}</div>
                              <label htmlFor={label}>{name}</label>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    )})}
                    {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </fieldset>
    </form>
  )
}

export default DragList

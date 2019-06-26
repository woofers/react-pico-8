/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

// Adapted from https://codesandbox.io/s/4qp6vjp319?from-embed

const indent = css`
  margin: 0;
  padding: 0;
`

const iconSize = css`
  display: inline-flex;
  min-width: 56px;
  flex-shrink: 0;
  padding-left: 16px;
`

const background = css`
  color: white;
  max-width: 400px;
`

const align = css`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 8px;
`

const getItems = items =>
  Object.keys(items).map(button => {
    const Icon = items[button]
    return {
      id: `item-${button}`,
      primary: button,
      icon: <Icon disabled={true} />
    }
  })

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
  return (
    <div css={background}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div ref={provided.innerRef}>
              <ul css={indent}>
                {p.items.map((pair, index) => {
                  const { name, Button } = pair
                  const id = `icon-${name}`
                  const icon = <Button disabled={true} />
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
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
                            <div css={iconSize}>{icon}</div>
                            <div>{name}</div>
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
    </div>
  )
}

export default DragList

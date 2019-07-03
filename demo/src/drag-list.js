/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

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

const hidden = css`
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
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
                    const icon = <Button selected={pair.enabled} disabled={true} />
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
                              <input id={label} css={check} type="checkbox" checked={pair.enabled} onChange={() => toggle(index)} />
                              <label css={hidden} htmlFor={label}>Show {name.toLowerCase()} button</label>
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
      </fieldset>
    </form>
  )
}

export default DragList

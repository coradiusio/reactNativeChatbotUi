import React from 'react'

import {
  View,
  Text,
  Image
} from 'react-native'

import {
  massageText
} from './utils'

const cloneDeep = require('clone-deep')

const _components = {
  View,
  Text,
  Image
}

const result = {}

let key = 1

const isInstanceOfObject = identifier => {
  return identifier && identifier.constructor === Object
}

const isInstanceOfArray = identifier => {
  return identifier && identifier.constructor === Array
}

const computeJSONForChildren = childrenComponent => {
  const childrenResult = {}
  if (childrenComponent) {
    childrenResult.type = childrenComponent.type.displayName || childrenComponent.type.name

    const temp = { ...childrenComponent.props }

    const { children } = childrenComponent.props

    temp.children = undefined

    if (Object.keys(temp).length > 0) {
      childrenResult.props = { ...temp }
    } else {
      childrenResult.props = {}
    }

    childrenResult.props.key = key++

    if (isInstanceOfObject(children)) {
      childrenResult.props.children = computeJSONForChildren(children)
    } else if (isInstanceOfArray(children)) {
      childrenResult.props.children = []

      children.forEach(innerChild => {
        const newChild = innerChild
        newChild.props.key = key++
        childrenResult.props.children.push(computeJSONForChildren(newChild))
      })
    } else if (typeof children === 'string') {
      childrenResult.props.children = children
    }
  }

  return childrenResult
}

const computeJSONForReactComponent = componentArg => {
  // first check type of component
  let component = cloneDeep(componentArg)
  if (isInstanceOfObject(component)) {
    result.type = component.type.displayName || component.type.name

    const temp = { ...component.props }
    const { children } = component.props
    temp.children = undefined

    if (Object.keys(temp).length > 0) {
      result.props = { ...temp }
    } else {
      result.props = {}
    }

    result.props.key = key++

    if (typeof children === 'string') {
      result.props.children = children
    } else if (isInstanceOfArray(children)) {
      result.props.children = []
      children.forEach((item, index) => {
        const newChild = item
        newChild.props.key = key++
        result.props.children[index] = computeJSONForChildren(newChild)
      })
    } else if (isInstanceOfObject(children)) {
      result.props.children = computeJSONForChildren(children)
    }
  }

  return result
}

const elementDecider = type => {
  return _components[type] || null
}

const createReactElement = (
  type,
  props,
  children,
  data
) => {
  const childrenComponents = []

  if (isInstanceOfObject(children)) {
    if (Object.keys(children).length > 0) {
      const innerChildren = cloneDeep(children.props.children)
      children.props.children = undefined
      childrenComponents.push(
        createReactElement(
          children.type,
          children.props,
          innerChildren || [],
          data
        )
      )
    }
  } else if (isInstanceOfArray(children)) {
    children.forEach(item => {
      childrenComponents.push(
        createReactElement(
          item.type,
          item.props,
          item.props.children || [],
          data
        )
      )
    })
  } else if (typeof children === 'string' || type) {
    console.log('children :- ', children)
    childrenComponents.push(massageText(children, data) || [])
  }

  if (type !== 'Image') {
    return React.createElement(
      elementDecider(type),
      props,
      childrenComponents
    )
  } else {
    return React.createElement(elementDecider(type), props)
  }
}

export const CreateComponentFromJSON = (
  cardJSON,
  data
) => {
  const cardJSONParsed = isInstanceOfObject(cardJSON) ? cardJSON : JSON.parse(cardJSON)

  const children = cardJSONParsed.props.children
  return createReactElement(
    cardJSONParsed.type,
    cardJSONParsed.props,
    children || [],
    data
  )
}

export const ReactComponentJSON = component => {
  const computedObject = computeJSONForReactComponent(component)
  return computedObject
}

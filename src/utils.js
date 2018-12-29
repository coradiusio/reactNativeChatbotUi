import { get, isUndefined, isEmpty } from 'lodash'

export const genericColors = {
  white: '#FFFFFF',
  red: '#FF0000',
  orange: '#ff9100',
  green: '#00C853',
  grey: '#f2f3f3',
  grey100: '#F5F5F5',
  blue: '#2979ff',
  lightGrey: '#9b9b9b',
  darkGrey: '#4a4a4a',
  blue500: '#2196f3'

}

export const colors = {
  primary: genericColors.blue,
  headerTitleColor: genericColors.white,
  headerSubTitleColor: genericColors.white,
  errorIconColor: genericColors.red,
  cancelEditColor: genericColors.orange,
  background: genericColors.grey,
  headerIconColor: genericColors.white,
  onlineIconColor: genericColors.green,
  radioColor: genericColors.blue500,

  receiverBubbleBackground: genericColors.white,
  receiverBubbleText: genericColors.darkGrey,
  receiverTimeText: genericColors.lightGrey,
  senderBubbleBackground: genericColors.blue,
  senderBubbleText: genericColors.white,
  senderTimeText: genericColors.white
}

const numbersComparisionOperators = [
  '==',
  '!=',
  '>',
  '>=',
  '<',
  '<='
]

const stringsComparisionOperators = [
  '==',
  '!='
]

export const stringCases = [
  'lower',
  'lowercase',
  'upper',
  'uppercase',
  'title',
  'titlecase'
]

export function stringCasing (value, casing) {
  switch (casing) {
    case 'lower':
    case 'lowercase':
      return value.toLowerCase()
    case 'upper':
    case 'uppercase':
      return value.toUpperCase()
    case 'title':
    case 'titlecase':
      return toTitleCase(value)
  }
  return value
}

export function toTitleCase (str) {
  str = str.toLowerCase().split(' ')
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1)
  }
  return str.join(' ')
};

export function isElementByIdValueEmpty (id) {
  const element = document.getElementById(id)
  return isEmpty(element && element.value)
}

function numberComparisionValidator (comparision, firstValue, secondValue) {
  switch (comparision) {
    case '==':
      return (firstValue === secondValue)
    case '!=':
      return (firstValue !== secondValue)
    case '>':
      return (firstValue > secondValue)
    case '>=':
      return (firstValue >= secondValue)
    case '<':
      return (firstValue < secondValue)
    case '<=':
      return (firstValue <= secondValue)
  }
  return false
}

function stringComparisionValidator (comparision, firstValue, secondValue) {
  switch (comparision) {
    case '==':
      return (firstValue === secondValue)
    case '!=':
      return (firstValue !== secondValue)
  }
  return false
}

export function validateInput (currentQuestion, answerInputModified, source = 'text') {
  const {
    widget,
    validateInput
  } = currentQuestion.input || {}

  const {
    output
  } = currentQuestion

  function validateByComparisionOperator (typeLowerCase, propertyNameLowerCase, comparisionOperator,
    answerInputModified, propertyValue, result) {
    const answerInputModifiedLength = answerInputModified.length
    if (typeLowerCase === 'number') {
      if (numbersComparisionOperators.indexOf(comparisionOperator) > -1) {
        if (propertyNameLowerCase === 'length') {
          if (!numberComparisionValidator(comparisionOperator, answerInputModifiedLength, propertyValue)) {
            result.foundError = true
          }
        } else if (propertyNameLowerCase === 'value') {
          if (!numberComparisionValidator(comparisionOperator, answerInputModified, propertyValue)) {
            result.foundError = true
          }
        } else {
          throw new Error('propertyName not matched')
        }
      }
    } else if (typeLowerCase === 'string') {
      if (stringsComparisionOperators.indexOf(comparisionOperator) > -1) {
        if (!stringComparisionValidator(comparisionOperator, answerInputModified, propertyValue)) {
          result.foundError = true
        }
      }
    } else {
      throw new Error('type not matching')
    }
    return result
  }

  function validateByRegexPattern (regexPattern, propertyNameLowerCase, answerInputModified, result) {
    const answerInputModifiedLength = answerInputModified.length
    console.log('propertyNameLowerCase :- ', propertyNameLowerCase)
    if (propertyNameLowerCase === 'length') {
      if (!regexPattern.test(answerInputModifiedLength)) {
        result.foundError = true
      }
    } else if (propertyNameLowerCase === 'value') {
      console.log('answerInputModified :- ', answerInputModified)
      console.log('regexPattern :- ', regexPattern)
      if (!regexPattern.test(answerInputModified)) {
        result.foundError = true
      }
    } else {
      throw new Error('propertyName not matched')
    }
    return result
  }

  function validator (allValidations, i) {
    const typeLowerCase = allValidations[i].type && allValidations[i].type.trim().toLowerCase()
    const comparisionOperator = allValidations[i].comparisionOperator && allValidations[i].comparisionOperator.trim()
    const regexPattern = allValidations[i].regexPattern && new RegExp(allValidations[i].regexPattern.trim(), 'i')
    const propertyNameLowerCase = allValidations[i].propertyName && allValidations[i].propertyName.toLowerCase()

    console.log('regexPattern :- ', regexPattern)
    if (regexPattern) {
      validateByRegexPattern(regexPattern, propertyNameLowerCase, answerInputModified, result)
    }
    if (comparisionOperator) {
      validateByComparisionOperator(typeLowerCase, propertyNameLowerCase, comparisionOperator,
        answerInputModified, allValidations[i].propertyValue, result)
    }
  }

  const result = {
    success: false,
    foundError: false,
    errorMessage: ''
  }

  if (['text', 'calendar', 'qrscanner', 'camera'].indexOf(widget) > -1) {
    if (answerInputModified !== '' && validateInput) {
      if (output.type === 'object') {
        if (validateInput.splitBy) {
          answerInputModified = answerInputModified.split(validateInput.splitBy)
        } else {
          answerInputModified = new Array(answerInputModified)
        }
      }
      const allValidations = validateInput.validations
      const outerRegexPattern = validateInput.regexPattern

      if (allValidations instanceof Array) {
        for (let i = 0; i < allValidations.length; i++) {
          validator(allValidations, i, outerRegexPattern)
          if (result.foundError) {
            result.success = false
            if (result.errorMessage === '') {
              result.errorMessage = allValidations[i].errorMessage || 'Input is invalid'
            }
            break
          } else {
            result.success = true
          }
        }
      }
    }
    if (!result.foundError) {
      result.success = true
    }
  } else if (widget === 'radio' || widget === 'checkbox') {
    if (answerInputModified !== '' && source === 'text') {
      result.foundError = true
      result.success = false
      result.errorMessage = currentQuestion.onInputFillMessage || 'Please select from below buttons'
    } else {
      result.success = true
    }
  } else if (widget === 'select' || widget === 'searchselect' || widget === 'file') {
    result.success = true
  }
  result.answerInputModified = answerInputModified
  return result
}

export function validateFile (currentQuestion, answerInputModified, fileName, fileExtension) {
  const result = {
    success: false,
    foundError: false,
    errorMessage: ''
  }

  if (!(isUndefined(fileExtension) || isEmpty(fileExtension))) {
    const {
      fileExtensions
    } = currentQuestion.input

    if (fileExtensions && fileExtensions.indexOf(fileExtension.toLowerCase()) > -1) {
      result.success = true
    } else {
      result.foundError = true
      result.errorMessage = currentQuestion.onWrongFileUploadMessage || 'Please upload valid file type'
    }
  } else {
    result.foundError = true
  }

  if (answerInputModified.indexOf('content://') > -1 && answerInputModified.indexOf('.') > -1) {
    result.success = true
    result.foundError = false
  }
  result.answerInputModified = answerInputModified
  return result
}

export function massageText (text, state = {}) {
  console.log('state :- ', state)
  if (text.indexOf('{') > -1 && text.indexOf('}') > -1) {
    try {
      const regexPattern = /\{(.*?)\}/g
      const matched = text.match(regexPattern)
      let temp

      if (matched) {
        for (let i = 0; i < matched.length; i++) {
          temp = matched[i].slice(1, -1)
          text = text.replace(new RegExp(`{${temp}}`, 'g'), get(state, temp))
        }

        return text
      }
    } catch (err) {
      console.error('Exception in massaging text :- ', err)
    }
  }

  return text
}

export function isValidDate (date) {
  return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date)
}

export function formatAMPM (date) {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours !== 0 ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  var strTime = hours + ':' + minutes + ' ' + ampm
  return strTime
}

export function animateScroll (someElement, duration) {
  if (someElement) {
    var start = someElement.scrollTop
    var end = someElement.scrollHeight
    var change = end - start
    var increment = 20
    animate(0)
  }

  function easeInOut (currentTime, start, change, duration) {
    // by Robert Penner
    currentTime /= duration / 2
    if (currentTime < 1) {
      return change / 2 * currentTime * currentTime + start
    }
    currentTime -= 1
    return -change / 2 * (currentTime * (currentTime - 2) - 1) + start
  }

  function animate (elapsedTime) {
    elapsedTime += increment
    var position = easeInOut(elapsedTime, start, change, duration)
    someElement.scrollTop = position
    if (elapsedTime < duration) {
      setTimeout(function () {
        animate(elapsedTime)
      }, increment)
    }
  }
}

export function resizeImage (img, extension, maxWidth, maxHeight, quality) {
  var canvas = document.createElement('canvas')

  var width = img.width
  var height = img.height

  // calculate the width and height, constraining the proportions
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round(height *= maxWidth / width)
      width = maxWidth
    }
  } else {
    if (height > maxHeight) {
      width = Math.round(width *= maxHeight / height)
      height = maxHeight
    }
  }

  // resize the canvas and draw the image data into it
  canvas.width = width
  canvas.height = height
  let ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)

  // preview.appendChild(canvas)
  // do the actual resized preview

  return canvas.toDataURL('image/'.concat(extension), quality) // get the data from canvas as 60% JPG (can be also PNG, etc.)
}

export function askConditionsCheck (currentQuestion, result) {
  let success = false
  let entityValue = ''
  let entityPath = ''

  for (let i = 0; i < currentQuestion.askConditions.length; i++) {
    // now first get entity value from propertyPath
    entityValue = ''
    entityPath = currentQuestion.askConditions[i].entityPath
    entityValue = get(
      result, `${entityPath && entityPath !== '' ? `${entityPath}.` : ''}${currentQuestion.askConditions[i].entity}`
    )
    if (entityValue === currentQuestion.askConditions[i].value) {
      success = true
    } else {
      success = false
      break
    }
  }
  return success
}

export function skipConditionsCheck (currentQuestion, result) {
  let success = false
  let entityValue = ''
  let entityPath = ''

  for (let i = 0; i < currentQuestion.skipConditions.length; i++) {
    // now first get entity value from propertyPath
    entityValue = ''
    entityPath = currentQuestion.skipConditions[i].entityPath
    entityValue = get(
      result, `${entityPath && entityPath !== '' ? `${entityPath}.` : ''}${currentQuestion.skipConditions[i].entity}`
    )
    if (entityValue === currentQuestion.skipConditions[i].value) {
      success = true
      break
    } else {
      success = false
    }
  }
  return success
}

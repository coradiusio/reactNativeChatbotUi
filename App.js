import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import FormBotApp from './src/FormBotApp';

import {
  colors
} from './src/general';

const uak_id = 7204;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uiData: {
        header: {
          title: 'Chatbot Assistant',
          subtitle: 'online',
          icon: {
            name: 'robot',
            type: 'material-community',
            color: colors.white,
            size: 40
          },
          subtitleIcon: {
            name: 'circle',
            type: 'material-community',
            color: colors.green,
            size: 12
          },
        },
        footer: {
          icon: {
            name: 'send',
            type: 'material-community',
            color: colors.primary,
            size: 32
          }
        }
      },
      logicalData: {
        result: {
          bank_details: 0,
          bse_registration_status: 0,
          pan_number: '',
          email: '',
          error: '',
          account_number: 0, 
          confirm_account_number: 0,
          account_type: '',
          ifsc_code: '',
          signature_image: '',
          cheque_image: '',
          kyc_status: 0,
          date_of_birth: '',
        },
        currentNode: 0,
        currentQuestionIndex: 0,
        questions: [
          {
            node: 1,
            question: ["what's your full name ?"],
            entity: "completeName",
            entityPath: "formData",
            widget: 'text',
            placeholder: 'Enter your full name',
            validateInput: {
              outputType: 'object',
              splitBy: ' ',
              keys: [
                {
                  keyName: 'firstName',
                  keyValueIndex: 0,
                  casing: 'titleCase'
                },
                {
                  keyName: 'middleName',
                  keyValueIndex: {
                    or: [
                      {
                        inputLength: 3,
                        keyValueIndex: 1,
                      }
                    ],
                  },
                  casing: 'titleCase'
                },
                {
                  keyName: 'lastName',
                  keyValueIndex: {
                    or: [
                      {
                        inputLength: 2,
                        keyValueIndex: 1,
                      },
                      {
                        inputLength: 3,
                        keyValueIndex: 2,
                      }
                    ],
                  },
                  casing: 'titleCase'
                }
              ],
              validations: [
                {
                  type: 'number',
                  comparisionOperator: '>=',
                  propertyName: 'inputLength',
                  propertyValue: 2,
                  errorMessage: 'Full name must contain atleast first and last name'
                },
                {
                  type: 'number',
                  comparisionOperator: '<=',
                  propertyName: 'inputLength',
                  propertyValue: 3,
                  errorMessage: 'Full name can only contain first, middle and last name'
                }
              ]
            }
          },
          {
            node: 2,
            question: ["Pls scan qr code"],
            entity: "qrcode",
            entityPath: "formData",
            widget: 'qrscanner',
            validateInput: {
              outputType: 'string',
            },
            placeholder: 'Click To Scan',
          },
          {
            node: 1,
            question: ["Now i want your's permanent address , so please enter your pincode"],
            entity: "csp",
            entityPath: "formData.permanentAddress",
            widget: 'searchselect',
            searchOptions: [
              { value: '400050', title: '400050', description: 'Bandra, Mumbai' },
              { value: '400053', title: '400053', description: 'Andheri, Mumbai' },
              { value: '560078', title: '560078', description: 'South End Circle, Bangalore' }
            ],
            validateInput: {
              outputType: 'string',
            },
            placeholder: 'Enter Your Pincode',
            minCharactersToSearch: 3,
          },
          {
            node: 2,
            question: ["what's your full name ?"],
            entity: "completeName",
            entityPath: "formData",
            widget: 'text',
            placeholder: 'Enter your full name',
            validateInput: {
              outputType: 'object',
              splitBy: ' ',
              keys: [
                {
                  keyName: 'firstName',
                  keyValueIndex: 0,
                  casing: 'titleCase'
                },
                {
                  keyName: 'middleName',
                  keyValueIndex: {
                    or: [
                      {
                        inputLength: 3,
                        keyValueIndex: 1,
                      }
                    ],
                  },
                  casing: 'titleCase'
                },
                {
                  keyName: 'lastName',
                  keyValueIndex: {
                    or: [
                      {
                        inputLength: 2,
                        keyValueIndex: 1,
                      },
                      {
                        inputLength: 3,
                        keyValueIndex: 2,
                      }
                    ],
                  },
                  casing: 'titleCase'
                }
              ],
              validations: [
                {
                  type: 'number',
                  comparisionOperator: '>=',
                  propertyName: 'inputLength',
                  propertyValue: 2,
                  errorMessage: 'Full name must contain atleast first and last name'
                },
                {
                  type: 'number',
                  comparisionOperator: '<=',
                  propertyName: 'inputLength',
                  propertyValue: 3,
                  errorMessage: 'Full name can only contain first, middle and last name'
                }
              ]
            }
          },
          {
            node: 2,
            question: ["what's your date of birth ?"],
            entity: "dateOfBirth",
            entityPath: "formData",
            widget: 'calendar',
            placeholder: 'Select Birth Date',
            validateInput: {
              outputType: 'string',
            },
          },
          {
            node: 3,
            question: ["what's your gender ?"],
            entity: "gender",
            entityPath: "formData",
            widget: 'radio',
            radioOptions: [
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' }
            ],
            onInputFillMessage: 'Hey , don\'t be oversmart , you have to choose one of below options',
            validateInput: {
              outputType: 'string',
            }
          },
          // {
          //   node: 1,
          //   question: ["what's your PAN number ?"],
          //   entity: "panNumber",
          //   entityPath: "formData",
          //   widget: 'text',
          //   placeholder: 'XXXXXXXXXX',
          //   inputMask: [/[A-Za-z]/, /[A-Za-z]/, /[A-Za-z]/, /[A-Za-z]/, /[A-Za-z]/, /\d/, /\d/, /\d/, /\d/, /[A-Za-z]/],
          //   validateInput: {
          //     outputType: 'string',
          //     casing: 'uppercase',
          //   }
          // },
          {
            node: 4,
            question: ["what's your full name ?"],
            entity: "completeName",
            entityPath: "formData",
            widget: 'text',
            placeholder: 'Enter your full name',
            validateInput: {
              outputType: 'object',
              splitBy: ' ',
              keys: [
                {
                  keyName: 'firstName',
                  keyValueIndex: 0,
                  casing: 'titleCase'
                },
                {
                  keyName: 'middleName',
                  keyValueIndex: {
                    or: [
                      {
                        inputLength: 3,
                        keyValueIndex: 1,
                      }
                    ],
                  },
                  casing: 'titleCase'
                },
                {
                  keyName: 'lastName',
                  keyValueIndex: {
                    or: [
                      {
                        inputLength: 2,
                        keyValueIndex: 1,
                      },
                      {
                        inputLength: 3,
                        keyValueIndex: 2,
                      }
                    ],
                  },
                  casing: 'titleCase'
                }
              ],
              validations: [
                {
                  type: 'number',
                  comparisionOperator: '>=',
                  propertyName: 'inputLength',
                  propertyValue: 2,
                  errorMessage: 'Full name must contain atleast first and last name'
                },
                {
                  type: 'number',
                  comparisionOperator: '<=',
                  propertyName: 'inputLength',
                  propertyValue: 3,
                  errorMessage: 'Full name can only contain first, middle and last name'
                }
              ]
            }
          },
          {
            node: 4,
            question: ["what's your age ?"],
            entity: "age",
            entityPath: "formData",
            widget: 'text',
            placeholder: 'Enter your age',
            validateInput: {
              outputType: 'number',
              regexPattern: '^\\d{2}$',
              validations: [
                {
                  type: 'number',
                  propertyName: 'inputValue',
                  comparisionOperator: '>=',
                  propertyValue: 18,
                  errorMessage: 'Age must be greater than 18'
                },
                {
                  type: 'number',
                  propertyName: 'inputValue',
                  comparisionOperator: '<=',
                  propertyValue: 75,
                  errorMessage: 'Age must be less than 75'
                }
              ]
            }
          },
          {
            node: 5,
            question: ["what's your email ?"],
            entity: "email",
            entityPath: "formData",
            widget: 'text',
            validateInput: {
              outputType: 'string',
              validations: [
                {
                  type: 'string',
                  propertyName: 'inputValue',
                  regexPattern: '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
                  errorMessage: 'Email id is invalid'
                },
              ]
            }
          },
          {
            node: 6,
            question: "What's your mobile ?",
            entity: "mobile",
            entityPath: "formData",
            widget: 'text',
            validateInput: {
              outputType: 'number',
              validations: [
                {
                  type: 'string',
                  propertyName: 'inputValue',
                  regexPattern: '/^\\d{10}$/',
                  errorMessage: 'Mobile number is invalid'
                },
              ]
            }
          },
          {
            node: 7,
            question: ["what's your gender ?"],
            entity: "gender",
            entityPath: "formData",
            widget: 'radio',
            radioOptions: [
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' }
            ],
            onInputFillMessage: 'Hey , don\'t be oversmart , you have to choose one of below options',
            validateInput: {
              outputType: 'string',
            }
          },
          {
            node: 8,
            question: ["what's your marital status ?"],
            entity: "maritalStatus",
            entityPath: "formData",
            widget: 'radio',
            radioOptions: [
              { value: 'M', label: 'Married' },
              { value: 'U', label: 'Unmarried' }
            ],
            onInputFillMessage: 'Hey , don\'t be oversmart , you have to choose one of below options',
            validateInput: {
              outputType: 'string',
            }
          },
          {
            node: 9,
            question: ["what's your husband name ?"],
            entity: "husbandName",
            entityPath: "formData",
            widget: 'text',
            askConditions: {
              and: [
                { entity: 'gender', entityPath: 'formData', value: 'female' },
                { entity: 'maritalStatus', entityPath: 'formData', value: 'M' }
              ]
            },
            validateInput: {
              outputType: 'object',
              splitBy: ' ',
              keys: [
                {
                  keyName: 'firstName',
                  keyValueIndex: 0,
                  casing: 'titleCase'
                },
                {
                  keyName: 'middleName',
                  keyValueIndex: {
                    or: [
                      {
                        inputLength: 3,
                        keyValueIndex: 1,
                      }
                    ],
                  },
                  casing: 'titleCase'
                },
                {
                  keyName: 'lastName',
                  keyValueIndex: {
                    or: [
                      {
                        inputLength: 2,
                        keyValueIndex: 1,
                      },
                      {
                        inputLength: 3,
                        keyValueIndex: 2,
                      }
                    ],
                  },
                  casing: 'titleCase'
                }
              ],
              validations: [
                {
                  type: 'number',
                  comparisionOperator: '>=',
                  propertyName: 'inputLength',
                  propertyValue: 2,
                  errorMessage: 'Full name must contain atleast first and last name'
                },
                {
                  type: 'number',
                  comparisionOperator: '<=',
                  propertyName: 'inputLength',
                  propertyValue: 3,
                  errorMessage: 'Full name can only contain first, middle and last name'
                }
              ]
            }
          },
          {
            node: 10,
            question: ["what's your father full name ?"],
            entity: "fatherName",
            entityPath: "formData",
            widget: 'text',
            validateInput: {
              outputType: 'object',
              splitBy: ' ',
              keys: [
                {
                  keyName: 'firstName',
                  keyValueIndex: 0,
                  casing: 'titleCase'
                },
                {
                  keyName: 'middleName',
                  keyValueIndex: {
                    or: [
                      {
                        inputLength: 3,
                        keyValueIndex: 1,
                      }
                    ],
                  },
                  casing: 'titleCase'
                },
                {
                  keyName: 'lastName',
                  keyValueIndex: {
                    or: [
                      {
                        inputLength: 2,
                        keyValueIndex: 1,
                      },
                      {
                        inputLength: 3,
                        keyValueIndex: 2,
                      }
                    ],
                  },
                  casing: 'titleCase'
                }
              ],
              validations: [
                {
                  type: 'number',
                  comparisionOperator: '>=',
                  propertyName: 'inputLength',
                  propertyValue: 2,
                  errorMessage: 'Full name must contain atleast first and last name'
                },
                {
                  type: 'number',
                  comparisionOperator: '<=',
                  propertyName: 'inputLength',
                  propertyValue: 3,
                  errorMessage: 'Full name can only contain first, middle and last name'
                }
              ]
            }
          },
          {
            node: 11,
            question: ["what's your mother full name ?"],
            entity: "motherName",
            entityPath: "formData",
            widget: 'text',
            validateInput: {
              outputType: 'object',
              splitBy: ' ',
              keys: [
                {
                  keyName: 'firstName',
                  keyValueIndex: 0,
                  casing: 'titleCase'
                },
                {
                  keyName: 'middleName',
                  keyValueIndex: {
                    or: [
                      {
                        inputLength: 3,
                        keyValueIndex: 1,
                      }
                    ],
                  },
                  casing: 'titleCase'
                },
                {
                  keyName: 'lastName',
                  keyValueIndex: {
                    or: [
                      {
                        inputLength: 2,
                        keyValueIndex: 1,
                      },
                      {
                        inputLength: 3,
                        keyValueIndex: 2,
                      }
                    ],
                  },
                  casing: 'titleCase'
                }
              ],
              validations: [
                {
                  type: 'number',
                  comparisionOperator: '>=',
                  propertyName: 'inputLength',
                  propertyValue: 2,
                  errorMessage: 'Full name must contain atleast first and last name'
                },
                {
                  type: 'number',
                  comparisionOperator: '<=',
                  propertyName: 'inputLength',
                  propertyValue: 3,
                  errorMessage: 'Full name can only contain first, middle and last name'
                }
              ]
            }
          },
          {
            node: 12,
            question: ["Whats your's residency status"],
            entity: "residency",
            entityPath: "formData",
            widget: 'radio',
            radioOptions: [
              { value: 'RI', label: 'Indian' },
              { value: 'NRI', label: 'NRI' }
            ],
            onInputFillMessage: 'Hey , don\'t be oversmart , you have to choose one of below options',
            validateInput: {
              outputType: 'string',
            }
          },
          {
            node: 13,
            question: ["Okk", "now i want your's permanent address , so please enter your pincode"],
            entity: "csp",
            entityPath: "formData.permanentAddress",
            widget: 'searchselect',
            searchOptions: [
              { value: '400050', title: '400050', description: 'Bandra, Mumbai' },
              { value: '400053', title: '400053', description: 'Andheri, Mumbai' },
              { value: '560078', title: '560078', description: 'South End Circle, Bangalore' }
            ],
            validateInput: {
              outputType: 'string',
            },
            placeholder: 'Enter Your Pincode',
            minCharactersToSearch: 3,
          },
          {
            node: 14,
            question: ["please enter house number along with road/street name if any"],
            entity: "addressLine1",
            entityPath: "formData.permanentAddress",
            widget: 'text',
            validateInput: {
              outputType: 'string',
            }
          },
          {
            node: 15,
            question: ["please enter landmark"],
            entity: "landmark",
            entityPath: "formData.permanentAddress",
            widget: 'text',
            validateInput: {
              outputType: 'string',
            }
          },
          {
            node: 16,
            question: ["is your current address same as permanent address ?"],
            entity: "isSameAsPermanent",
            entityPath: "formData.currentAddress",
            widget: 'radio',
            radioOptions: [
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ],
            validateInput: {
              outputType: 'string',
            }
          },
          {
            node: 17,
            question: ["okk , so i want your's current address also , so please enter your pincode"],
            entity: "csp",
            entityPath: "formData.currentAddress",
            askConditions: {
              and: [
                { entity: 'isSameAsPermanent', entityPath: 'formData.currentAddress', value: 'no' },
              ],
            },
            widget: 'searchselect',
            searchOptions: [
              { value: '400050', title: '400050', description: 'Bandra, Mumbai' },
              { value: '400053', title: '400053', description: 'Andheri, Mumbai' },
              { value: '560078', title: '560078', description: 'South End Circle, Bangalore' }
            ],
            validateInput: {
              outputType: 'string',
            },
            placeholder: 'Enter Your Pincode',
            minCharactersToSearch: 3,
          },
          {
            node: 18,
            question: ["please enter house number along with road/street name if any"],
            entity: "addressLine1",
            entityPath: "formData.currentAddress",
            widget: 'text',
            askConditions: {
              and: [
                { entity: 'isSameAsPermanent', entityPath: 'formData.currentAddress', value: 'no' },
              ],
            },
            validateInput: {
              outputType: 'string',
            }
          },
          {
            node: 19,
            question: ["please enter landmark"],
            entity: "landmark",
            entityPath: "formData.currentAddress",
            widget: 'text',
            askConditions: [
              { entity: 'isSameAsPermanent', entityPath: 'formData.currentAddress', value: 'no' },
            ],
            validateInput: {
              outputType: 'string',
            }
          },
          {
            node: 20,
            question: ["What's your children category ?"],
            entity: "gender",
            entityPath: "formData",
            widget: 'checkbox',
            checkboxOptions: [
              { value: 'son', label: 'Son' },
              { value: 'daughter', label: 'Daughter' },
            ],
            onInputFillMessage: 'Hey , don\'t be oversmart , you have to select from below options',
            validateInput: {
              outputType: 'array',
              joinWith: ', '
            },
          },
          {
            node: 21,
            question: ["please upload your aadhaar !"],
            entity: "aadhaarImage",
            entityPath: "formData",
            widget: 'file',
            fileExtensions: ['jpg', 'png', 'jpeg', 'pdf'],
            validateInput: {
              outputType: 'string',
            },
            showFileUploadButtonIcon:true,
            placeholder: 'Click to upload aadhaar'
          },
          {
            node: 22,
            question: ["please upload your pan card !"],
            entity: "pancard",
            entityPath: "formData",
            fileExtensions: ['jpg', 'png', 'jpeg', 'pdf'],
            widget: 'file',
            validateInput: {
              outputType: 'string',
            }
          },
          {
            node: 23,
            question: ["Okk thanks for info", "now you have to make payment , can we proceed ?"],
            widget: 'radio',
            radioOptions: [
              { value: 'payment_proceed_yes', label: 'Yes' },
              { value: 'payment_proceed_no', label: 'No' },
              { value: 'payment_proceed_later', label: 'Later' }
            ],
            validateInput: {
              outputType: 'string',
            }
          },
        ],
        repliedMessages: [],
        isBotTyping: false,
        isUserTyping: false,
        isUserAllowedToAnswer: false,
      }
    }
  }

  render() {
    const {
      uiData,
      logicalData
    } = this.state;

    return (
      <View style={styles.container}>
        <FormBotApp uiData={uiData} logicalData={logicalData} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
});

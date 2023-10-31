const SETTINGS = {

  TICKET_STATUSES: {
    0:  'CONFIRMED',
    4:  'LOSE',
    5:  'WON (Not Paid)',
    6:  'WON (Paid Out)',
    9:  'EXPIRED',
    13: 'CANCELLED'
  },

  STAKE_STATUSES: {
    0:  'OPEN',
    4:  'LOSE',
    5:  'WIN',
    13: 'CANCEL',
  },

  TICKET_ACTIONS: {
    ADD: 'add',
    EDIT: 'edit',
    TRANSFER: 'transfer',
    PASSWORD: 'password',
    DROPDOWN: 'dropdown',
    PRINT: 'print',
    CALCULATE: 'calculate',
    CANCEL: 'cancel'
  }
}

export default SETTINGS

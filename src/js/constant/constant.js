const SETTINGS = {

  API: {
    tree:         'tree/',
    accounts:     'accounts/',
    shops:        'shops/',
    tickets:      'tickets/',
    daily_sums:   'dailySums/',
    currencies:   'currencies/'
  },

  STAKE_STATUSES: {
    0:  'OPEN',
    4:  'LOSE',
    5:  'WIN',
    13: 'CANCEL',
  },

  // LOCKED: {
  //   0: 'NO',
  //   1: 'YES',
  // },

  TICKET_STATUSES: {
    0:  'CONFIRMED',
    4:  'LOSE',
    5:  'WON (Not Paid)',
    6:  'WON (Paid Out)',
    9:  'EXPIRED',
    13: 'CANCELLED'
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

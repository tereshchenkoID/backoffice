import Base from './base'

const base =  new Base()

export default function Ticket() {}

Ticket.prototype.html = function(data, shop) {
  let html = `<div class="ticket" id="js-ticket">
                        <div class="ticket__head">
                          <div class="ticket__logo">
                            <img class="img" src="https://api.qool90.bet/img/vb.png">
                          </div>
                          <div class="ticket__meta">
                            <div class="ticket__wrapper">
                              <div class="ticket__row">
                                <div class="u-text-left">
                                  <span data-lang="shop"></span>
                                  <span>:</span>
                                </div>
                                <strong class="u-text-right">${shop}</strong>
                              </div>
                              <div class="ticket__row">
                                <div class="u-text-left">
                                  <span data-lang="bet"></span>
                                  <span>:</span>
                                </div>
                                <strong class="u-text-right">${base.getDate(data.placed)}</strong>
                              </div>
                              <div class="ticket__row">
                                <div class="u-text-left">
                                  <span data-lang="time"></span>
                                  <span>:</span>
                                </div>
                                <strong class="u-text-right">${base.getDate(data.placed, 'time-local')}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="ticket__body">
                          <div class="ticket__title u-text-center">
                            <span class="u-mr-8 u-text-transform-uppercase" data-lang="ticket"></span>
                            <strong>#${data.id}</strong>
                          </div>
                          <div class="ticket__code u-text-center">${data.id}</div>`

              data.group.forEach(item => {
                html += `<div class="ticket__block">
                           <div class="ticket__row">
                              <div class="u-text-left">
                                <span class="u-text-transform-uppercase" data-lang="gr"></span>
                                <span>:</span>
                                <strong>${item.group}</strong>
                              </div>
                              <div class="u-text-right"><strong>${item.amount}</strong></div>
                           </div>
                           <div class="ticket__row">
                               <div class="u-text-left">
                                 <span data-lang="min_max_win"></span>
                                 <span>:</span>
                               </div>
                               <div class="u-text-right">
                                  ${data.currency} <strong>${item.minwin.toFixed(2)}</strong>
                                  /
                                  ${data.currency} <strong>${item.maxwin.toFixed(2)}</strong>
                               </div>
                           </div>
                         </div>`
              })

              data.bets.forEach(item => {
                html += `<div class="ticket__block">
                           <div class="ticket__row ticket__row--3">
                               <div class="u-text-left"><strong>${item.details.eventId}</strong></div>
                               <div class="u-text-left">`

                                if (item.details.teams) {
                                  html += `${item.details.teams.away} - ${item.details.teams.home}`
                                }

                      html += `</div>
                               <div class="u-text-right"><strong>${item.amount}</strong></div>
                           </div>
                           <div class="ticket__row ticket__row--3">
                               <div class="u-text-left">${base.getDate(item.details.start, 'time-local')}</div>
                               <div class="u-text-left">${item.market} : ${item.selection}</div>
                               <div class="u-text-right"><strong>${item.odds}</strong></div>
                           </div>
                         </div>`
              })

            html += `  </div>
                      </div>
                      <div class="u-text-right">
                        <button type="button" class="button button--primary js-ticket-print" title="Print ticket" data-lang="print"></button>
                      </div>`

  return html
}



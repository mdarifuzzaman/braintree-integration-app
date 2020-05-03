import React, {useEffect, useContext} from 'react'
import 'react-bootstrap/dist/react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import {PaymentContext} from '../PaymentContext';

export const PaymentForm = (props) =>
{
    const paymentContext = useContext(PaymentContext);
    const {tokenObject, paymentTransaction, isPaymentMade, setIsPaymentMade, transactionData, setTransactionData} = paymentContext;
    
    useEffect(()=> {
        renderPayment();
        
    });

    const renderPayment = ()=> {
        let token = tokenObject;
        let authorization = token;
        var form = document.querySelector('#cardForm');
        window.braintree.client.create({
            authorization: authorization
        }, (err, clientInstance)=> {
        if(err){
            console.log(err);
            return;
        }
        createHostedFields(clientInstance, form);
        });

        const createHostedFields = (clientInstance, form) => {
        window.braintree.hostedFields.create({
            client: clientInstance,
            styles: {
                'input': {
                'font-size': '16px',
                'font-family': 'courier, monospace',
                'font-weight': 'lighter',
                'color': '#ccc'
                },
                ':focus': {
                'color': 'black'
                },
                '.valid': {
                'color': '#8bdda8'
                }
            },
            fields: {
                number: {
                selector: '#card-number',
                placeholder: '4111 1111 1111 1111'
                },
                cvv: {
                selector: '#cvv',
                placeholder: '123'
                },
                expirationDate: {
                selector: '#expiration-date',
                placeholder: 'MM/YYYY'
                },
                postalCode: {
                selector: '#postal-code',
                placeholder: '11111'
                }
            }
            }, function (err, hostedFieldsInstance) {
                var teardown = function (event) {

                    event.preventDefault();

                    var formIsInvalid = false;
                    var state = hostedFieldsInstance.getState();

                    // Loop through the Hosted Fields and check
                    // for validity, apply the is-invalid class
                    // to the field container if invalid
                    Object.keys(state.fields).forEach(function(field) {
                        if (!state.fields[field].isValid) {
                            $(state.fields[field].container).addClass('is-invalid');
                            formIsInvalid = true;
                        }
                    });

                    if (formIsInvalid) {
                        // skip tokenization request if any fields are invalid
                        alert("Card input is not valid");
                        return;
                    }

                    hostedFieldsInstance.tokenize({
                        // include the cardholderName in the tokenization
                        // request
                        cardholderName: $('#cc-name').val()
                        }, 
                        function(err, payload) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            console.log(payload.nonce);
                            paymentTransaction({nonce: payload.nonce, amount: 100.00});
                            // This is where you would submit payload.nonce to your server
                        }
                    );
                    
            };
            
            form.addEventListener('submit', teardown, false);
            });
          }
    }

    const onCancelPayment = ()=>{

    }

    const gotoPayment = ()=>{
        setIsPaymentMade(false);
        setTransactionData({});
    }
    
    return(
        <>
            {isPaymentMade? 
            <div className="demo-frame">
                <h3>Server returns {transactionData.success ? 'with success' : 'with failure'} with below data</h3>
                <div>
                    Amount: {transactionData.transaction !== undefined ? transactionData.transaction.amount: 'N/A'} <br></br>
                    PaymentInstrumentType = {transactionData.transaction !== undefined ? transactionData.transaction.paymentInstrumentType: 'N/A'} <br></br>
                    Status                = {transactionData.transaction !== undefined ? transactionData.transaction.status: 'N/A'} <br></br>
                    Transaction id        = {transactionData.transaction !== undefined ? transactionData.transaction.id: 'N/A'} <br></br>
                </div>
                <div>
                    <a className="btn btn-primary" onClick={gotoPayment}>Go back to payment page</a>
                </div>
            </div> :
            
                <div className="demo-frame">  
                    <form submit="/" method="post" id="cardForm" >
                        <label className="hosted-fields--label" for="card-number">Card Number</label>
                        <div id="card-number" className="hosted-field"></div>

                        <label className="hosted-fields--label" for="expiration-date">Expiration Date</label>
                        <div id="expiration-date" className="hosted-field"></div>

                        <label className="hosted-fields--label" for="cvv">CVV</label>
                        <div id="cvv" className="hosted-field"></div>

                        <label className="hosted-fields--label" for="postal-code">Postal Code</label>
                        <div id="postal-code" className="hosted-field"></div>

                        <div className="button-container">
                            <input style={{marginRight: 2 + 'px'}} type="submit" className="btn btn-primary" value="Purchase" id="submit"/>
                            &nbsp;<a style={{marginRight: 2 + 'px'}} className="btn btn-warning" onClick={onCancelPayment}>Cancel</a> 
                        </div>
                    </form>
                </div>
            }
        </>
    );
}

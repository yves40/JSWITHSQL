//----------------------------------------------------------------------------
//    testpromise.js
//
//    Dec 30 2019   Initial
//    Dec 31 2019   More tests
//----------------------------------------------------------------------------
const errorlimit = 5;
//----------------------------------------------------------------------------
function getTime() {
  let d = new Date();
  return d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") + ' ' ;
}
//----------------------------------------------------------------------------
function delayed(processID, label = 'Unset', delay = 2) {
  return new Promise( (resolve, reject) => {
    setTimeout( () => {
      if (delay > errorlimit) {
        resolve(`${getTime()}  [${processID}] : ${label} Ended - Success`); 
      }
      else {
        reject(`${getTime()}  [${processID}] : ${label} Ended - Failure`); 
      }
    }, delay * 1000);
    console.log(`${getTime()}  [${processID}] : ${label} Started`);
  })
}
//----------------------------------------------------------------------------
delayed(1, 'One waiting for 2 seconds (default)') // Default value
  .then( (result) => console.log(result))
  .catch( (error) => console.log(error));
//----------------------------------------------------------------------------
let TWO = delayed(2, 'Two waiting for 2 seconds', 2);
TWO
  .then( (result) => console.log(result))
  .catch( (error) => console.log(error));
//----------------------------------------------------------------------------
let THREE = delayed(3, 'Three waiting for 4 seconds', 4)
THREE
  .then( (result) => console.log(result))
  .catch( (error) => console.log(error));
//----------------------------------------------------------------------------
let FOUR = delayed(4, 'Four waiting for 8 seconds', 8);
FOUR
  .then( (result) => console.log(result))
  .catch( (error) => console.log(error));
//----------------------------------------------------------------------------
let todo4 = async () => {
  try {
    let FIVE = await delayed(5, 'Five waiting for 16 seconds', 16);
    let SIX = await delayed(6, 'Six waiting for 5 seconds', 5);
  }
  catch(error) {
    console.log('Oh my god :-( ' + error);
  }
}
todo4();
//----------------------------------------------------------------------------
let SEVEN = delayed(7, 'SEVEN waiting for 10 seconds', 10);
let EIGHT = delayed(8, 'EIGHT waiting for 14 seconds', 14);
let NINE = delayed(9, 'NINE waiting for 10 seconds', 10);
Promise.all([SEVEN, EIGHT, NINE])
  .then( (result) => console.log(result))
  .catch( (error) => console.log(error));


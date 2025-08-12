//----------------------------------------------------------------------------
//    testpromise.js
//
//    Dec 30 2019   Initial
//    Dec 31 2019   More tests
//----------------------------------------------------------------------------
function getTime() {
  let d = new Date();
  return d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") + ' ' ;
}

function delayed(value, label = 'Unset', delay = 2) {
  return new Promise( (resolve, reject) => {
    console.log(getTime() + `[ ${label} ] Promise INIT`);
    setTimeout( () => {
      if (value > 5) {
        resolve('OK for *** ' + value); 
      }
      else {
        reject('KO for *** ' + value); 
      }
      console.log(getTime() + `[ ${label} ] Promise EXIT`);
    }, delay * 1000)
  })
}

delayed(1, 'Test One: 1 for 2 seconds')
  .then( 
    (result) => console.log(result)
  )
  .catch( (error) => console.log(error));

let TWO = delayed(2, 'Test Two; 2 for 2 seconds', 2);
TWO.catch( (error) => console.log(error));

let THREE = delayed(4, 'Test Three: 4 for 4 seconds', 4)
THREE.catch((error) => console.log(error))

let FOUR = delayed(8, 'Test Four: 8 for 8 seconds', 8);
FOUR.then((result) => console.log(result)).catch( (error) => console.log(error));

let todo4 = async () => {
  try {
    let FIVE = await delayed(16, 'Test Five: 16 for 16 seconds', 16);
    console.log(FIVE);
    let SIX = await delayed(3, 'Test Six: 3 for 5 seconds', 5);
    console.log(SIX);
  }
  catch(error) {
    console.log('Oh my god :-( ' + error);
  }
}

todo4();

/*------------------------------------------------------------------------------------------------------
 *          moduleSQL.js
 *          
 *          Aug 19 2025     Initial
 ------------------------------------------------------------------------------------------------------*/
"use strict";

const moduleSQL = (function () {

    //---------------- MODULE SCOPE VARIABLES --------------
    const Version = "moduleSQL.js Aug 19 2025, 1.01";
    //------------------- EVENT HANDLERS -------------------

    //--------------------- DOM METHODS --------------------

    //------------------- PRIVATE METHODS ------------------
    function privateTest() {
        return '********** Date from privateTest()';
    }

    //------------------- PUBLIC METHODS -------------------

    function getVersion() {
        return Version;
    }

    return {
        getVersion: getVersion,
    };
}());

export { 
    moduleSQL as moduleSQL,  
};

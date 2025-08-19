/*------------------------------------------------------------------------------------------------------
 *          template.js
 *          
 *          Feb 14 2018     Initial
 *          Feb 17 2018     WIP on template content and test it
 *          Aug 19 2025     Back to some best practices
 ------------------------------------------------------------------------------------------------------*/
/*jslint    browser : true, continue : true,
            devel : true, indent : 2, maxerr : 50,
            newcap : true, nomen : true, plusplus : true,
            regexp : true, sloppy : true, vars : false,
            white : true
 */
"use strict";


const sql = (function () {

    //---------------- MODULE SCOPE VARIABLES --------------

    const Version = "moduletemplate.js Aug 19 2025, 1.01";

    //------------------- EVENT HANDLERS -------------------

    //--------------------- DOM METHODS --------------------

    //------------------- PRIVATE METHODS ------------------

    //------------------- PUBLIC METHODS -------------------

    function getVersion() {
        return Version;
    }

    return {
        getVersion: getVersion
    };
}());

export { sql as sqlutils } ;

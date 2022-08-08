const RESULTS_MESSAGES = global.get("RESULTS_MESSAGES");
//const COUNTRIES = global.get("COUNTRIES");
//const SID_D13 = global.get('SID_D13');
//const SID_PM3 = global.get('SID_PM3');

// TX
const TX_OOUS = global.get('TX_OOUS');
const TX_ZJPGTEST = global.get('TX_ZJPGTEST');
const N = global.get('N');

// Status de las acciones
const STATUSID_SV = global.get('STATUSID_SV');
const STATUSNUMBER_018 = global.get('STATUSNUMBER_018');
const STATUSID_DH = global.get('STATUSID_DH');
const STATUSNUMBER_802 = global.get('STATUSNUMBER_802');
const STATUSID_01 = global.get('STATUSID_01');
const STATUSNUMBER_039 = global.get('STATUSNUMBER_039');
const STATUSID_SUID01 = global.get('STATUSID_SUID01');
const STATUSNUMBER_029 = global.get('STATUSNUMBER_029');


// Parámetros de entrada
let userNew = msg.config.userNew;
let userRef = msg.config.userRef;
//let sid = msg.config.sid || 'PM3';
//const country = msg.config.country || 'BR';

msg.result = {
    code: 1,
    description: ""
}

if (msg.ctrError) {
    msg.step4 = 'Error en creacion de clase'
} else {

/**
 *
 * Inicialización geroSap 
 * 
 **/
const geroSap = msg.geroSap;

// TX donde se hace la comprobación de usuarios, establecimiento de fecha y roles
geroSap.setText('wnd[0]/tbar[0]/okcd', TX_OOUS);
geroSap.sendKey('wnd[0]', 0);
    // Verificación de usuario dado de alta (si es válido o no está vacío)
    if (userNew.length != 0) {
        geroSap.sendKey('wnd[0]', 4);
        geroSap.setText('wnd[1]/usr/tabsG_SELONETABSTRIP/tabpTAB001/ssubSUBSCR_PRESEL:SAPLSDH4:0220/sub:SAPLSDH4:0220/txtG_SELFLD_TAB-LOW[0,24]', userNew);
        geroSap.press('wnd[1]/tbar[0]/btn[0]');
        geroSap.press('wnd[1]/tbar[0]/btn[0]');
        
        // Comprueba resultado de búsqueda para Usuario
        const statusUserNew = await geroSap.findById('wnd[0]/sbar');
        const statusIdCheckUserNew = statusUserNew.MessageId.__value;
        const statusNumberCheckstatusUserNew = statusUserNew.MessageNumber.__value;

        if (statusIdCheckUserNew.trim() == STATUSID_DH && statusNumberCheckstatusUserNew == STATUSNUMBER_802) {
            
            // Cancelación y vuelta a la pantalla de inicio
            geroSap.press('wnd[1]/tbar[0]/btn[12]');
            geroSap.setText('wnd[0]/tbar[0]/okcd', N);
            geroSap.sendKey('wnd[0]', 0);
            if (msg.result.code < 3) msg.result.code = 3;
            msg.result.description = RESULTS_MESSAGES[0][1];
            return msg;
        }
    } else if (userNew === "") {
        if (msg.result.code < 3) msg.result.code = 3;
        msg.result.description = RESULTS_MESSAGES[1][1];
        return msg;
    }
    // Verificación de usuario referencia (si es válido o no está vacío)
    if (userRef.length != 0) {
        geroSap.sendKey('wnd[0]', 4);
        geroSap.setText('wnd[1]/usr/tabsG_SELONETABSTRIP/tabpTAB001/ssubSUBSCR_PRESEL:SAPLSDH4:0220/sub:SAPLSDH4:0220/txtG_SELFLD_TAB-LOW[0,24]', userRef);
        geroSap.press('wnd[1]/tbar[0]/btn[0]');
        geroSap.press('wnd[1]/tbar[0]/btn[0]');
        
        // Comprueba resultado de búsqueda para Usuario
        const statusUserRef = await geroSap.findById('wnd[0]/sbar');
        const statusIdCheckUserRef = statusUserRef.MessageId.__value;
        const statusNumberCheckUserRef = statusUserRef.MessageNumber.__value;

        if (statusIdCheckUserRef.trim() == STATUSID_DH && statusNumberCheckUserRef == STATUSNUMBER_802) {
            // Cancelación y vuelta a la pantalla de inicio
            geroSap.press('wnd[1]/tbar[0]/btn[12]');
            geroSap.setText('wnd[0]/tbar[0]/okcd', N);
            geroSap.sendKey('wnd[0]', 0);
            if (msg.result.code < 3) msg.result.code = 3;
            msg.result.description = RESULTS_MESSAGES[2][1];
            return msg;
        }
    } else if (userRef === "") {
        if (msg.result.code < 3) msg.result.code = 3;
        msg.result.description = RESULTS_MESSAGES[3][1];
        return msg;
    }

    /**
     * Si los datos pasamos por el formulario son válidos
     */

    //msg.result = RESULTS_MESSAGES[4][1];

    // Transacción OOUS
    geroSap.setText('wnd[0]/tbar[0]/okcd', TX_OOUS);
    geroSap.sendKey('wnd[0]', 0);

    // Se establece fecha de validez al usuario
    geroSap.setText('wnd[0]/tbar[0]/okcd', userNew);
    geroSap.press('wnd[0]/tbar[1]/btn[18]');
    geroSap.select('wnd[0]/usr/tabsTABSTRIP1/tabpLOGO');
    geroSap.setText('wnd[0]/usr/tabsTABSTRIP1/tabpLOGO/ssubMAINAREA:SAPLSUID_MAINTENANCE:1101/ctxtSUID_ST_NODE_LOGONDATA-GLTGB', "31.12.9999");
    geroSap.press('wnd[0]/tbar[0]/btn[11]');

    const statusChanges = await geroSap.findById('wnd[0]/sbar');
    const statusChangesID = statusChanges.MessageId.__value;
    const statusChangesNumber = statusChanges.MessageNumber.__value;
    node.warn(statusChangesID);
    node.warn(statusChangesNumber);

    if (statusChangesID.trim() == STATUSID_01 && statusChangesNumber == STATUSNUMBER_039) {
        msg.result.description = msg.result.description + RESULTS_MESSAGES[4][1];
    } else if (statusChangesID.trim() == STATUSID_SUID01 && statusChangesNumber == STATUSNUMBER_029){
        msg.result.description = msg.result.description + RESULTS_MESSAGES[5][1];
    }

    // Transacción OOUS
    geroSap.setText('wnd[0]/tbar[0]/okcd', TX_OOUS);
    geroSap.sendKey('wnd[0]', 0);

    // Se establece usuario referencia en la búsqueda
    geroSap.setText('wnd[0]/usr/ctxtSUID_ST_BNAME-BNAME', userRef);
    geroSap.press('wnd[0]/tbar[1]/btn[18]');

    // Pestaña de roles
    geroSap.select('wnd[0]/usr/tabsTABSTRIP1/tabpACTG');

    // Almacenamiento de roles
    msg.cellValuesRef = [];
    let headAlvRef = await geroSap.findById('wnd[0]/usr/tabsTABSTRIP1/tabpACTG/ssubMAINAREA:SAPLSUID_MAINTENANCE:1106/cntlG_ROLES_CONTAINER/shellcont/shell');
    let headRowsRef = new Array(headAlvRef['rowcount'].__value);
    
    // Si existen resultados
    if (headRowsRef.length > 0) {
        // Scroll a ALV para que se carguen todos los resultados
        const rowsOnScreen = headAlvRef.VisibleRowCount.__value;
        let avpag;
        avpag = headAlvRef.VisibleRowCount.__value;
        // VERIFICAR QUE ESTE BLOQUE DE CODIGO FUNCIONA CORRECTAMENTE
        // MOVER SCROL HACIA ABAJO PARA CARGAR TODOS LOS VALORES
        do {
            if (avpag < headRowsRef.length) {
                headAlvRef.FirstVisibleRow = avpag;
            }
            avpag = avpag + rowsOnScreen;
        } while (avpag <= headRowsRef.length);

        // Roles usuario de referencia
        for (let index = 0; index < headRowsRef.length; index++) {
            msg.cellValuesRef.push(headAlvRef.GetCellValue(index, 'AGR_NAME'));
        }

        // Transacción OOUS
        geroSap.setText('wnd[0]/tbar[0]/okcd', TX_OOUS);
        geroSap.sendKey('wnd[0]', 0);

        // Se establece usuario dado de alta en la búsqueda
        geroSap.setText('wnd[0]/usr/ctxtSUID_ST_BNAME-BNAME', userNew);
        geroSap.press('wnd[0]/tbar[1]/btn[18]');

        // Pestaña roles
        geroSap.select('wnd[0]/usr/tabsTABSTRIP1/tabpACTG');

        // Almacenamiento de roles
        let headAlvNew = await geroSap.findById('wnd[0]/usr/tabsTABSTRIP1/tabpACTG/ssubMAINAREA:SAPLSUID_MAINTENANCE:1106/cntlG_ROLES_CONTAINER/shellcont/shell');
        let headRowsNew = new Array(headAlvNew['rowcount'].__value);
        msg.cellValuesNew = [];

        // Roles de usuario dado de alta
        for (let index = 0; index < headRowsNew.length; index++) {
            msg.cellValuesNew.push(headAlvNew.GetCellValue(index, 'AGR_NAME'));
        }

        // Comprobación del usuario dado de alta al usuario de referencia si contiene los mismos roles
        /*for (let i = 0; i < headRowsRef.length; i++) {
            let element = msg.cellValuesRef[i]
            if (!msg.cellValuesNew.includes(element)) {
                //node.warn("No tiene mismos roles.");
                //noContainsRoles = true;
                //break;
                headAlvNew.ModifyCell(i, 'AGR_NAME', element);
                geroSap.sendKey('wnd[0]', 0);
            }
        }
        geroSap.press('wnd[0]/tbar[0]/btn[11]');*/



        //let currentRow = headAlvNew.CurrentCellRow; // Coge valor de fila actual
        //currentRow++; //++

        let containsRol = new Boolean(true);
        // Comprobación del usuario dado de alta al usuario de referencia si contiene los mismos roles
        for (let i = 0; i < headRowsRef.length; i++) {
            let element = msg.cellValuesRef[i];
            
            if (!msg.cellValuesNew.includes(element)) {

                /*headAlvNew.InsertRows(currentRow.toString());
                headAlvNew.ModifyCell(currentRow, 'AGR_NAME', element);
 
                geroSap.sendKey('wnd[0]', 0);
                currentRow++;*/
                containsRol = false;
                break;
            }
        }

        if (containsRol === true){
            msg.result.description = msg.result.description + RESULTS_MESSAGES[6][1];
        } else {
            if (msg.result.code < 2) msg.result.code = 2;
            msg.result.description = msg.result.description + RESULTS_MESSAGES[7][1];
        }

    }

    
    /**
     * Registros (Usuario dado de alta)
     */

    // Transacción nZJPGTEST (YIEK)
    geroSap.setText('wnd[0]/tbar[0]/okcd', TX_ZJPGTEST);
    geroSap.sendKey('wnd[0]', 0);

    // Selection -> By Contents -> Búsqueda de usuario dado de alta
    geroSap.select("wnd[0]/mbar/menu[3]/menu[0]");
    let tableSelectionNew = await geroSap.findById("wnd[1]/usr/tblSAPLSVIXTCTRL_SEL_FLDS");
    tableSelectionNew.getAbsoluteRow(1).Selected = -1;
    geroSap.press("wnd[1]/tbar[0]/btn[0]");
    geroSap.setText("wnd[1]/usr/tblSAPLSVIXTCTRL_QUERY/txtQUERY_TAB-BUFFER[3,0]", userNew);
    geroSap.press("wnd[1]/tbar[0]/btn[8]");

    // Registros filtrados por usuario dado de alta
    let tableEntriesNew = await geroSap.findById('wnd[0]/usr/tblSAPLZTESTJPG1TCTRL_ZTESTJPG1');
    let totalTableEntriesNew = tableEntriesNew.Columns.Item(1).Length.__value;
    msg.contentsNew = [];
    let cont = 0;
    const valuesRegister = await geroSap.getTextValue('wnd[0]/sbar');
    // VERIFICAR CON ID DE MENSAJE
    if (valuesRegister != 'No entries found that match the selection criteria.'){
        
        if (totalTableEntriesNew > 0) {

            // Guardado de entries en una lista
            for (let i = 0; i < totalTableEntriesNew; i++) {
                try {
                    let content = tableEntriesNew.GetCell(i, 1).text.__value;
                    msg.contentsNew.push(content);
                    if (cont > 10) cont = 0, tableEntriesNew.VerticalScrollbar.Position(i);
                    cont++;

                } catch (error) {

                }
            }
        }

    }

    
    
    

    /**
     * Registros usuario referencia
     */

    // Transacción nZJPGTEST
    geroSap.setText('wnd[0]/tbar[0]/okcd', TX_ZJPGTEST);
    geroSap.sendKey('wnd[0]', 0);

    // Selection -> By Contents -> Búsqueda de usuario referencia
    geroSap.select("wnd[0]/mbar/menu[3]/menu[0]");
    let tableSelectionRef = await geroSap.findById("wnd[1]/usr/tblSAPLSVIXTCTRL_SEL_FLDS");
    tableSelectionRef.getAbsoluteRow(1).Selected = -1;
    geroSap.press("wnd[1]/tbar[0]/btn[0]");
    geroSap.setText("wnd[1]/usr/tblSAPLSVIXTCTRL_QUERY/txtQUERY_TAB-BUFFER[3,0]", userRef);
    geroSap.press("wnd[1]/tbar[0]/btn[8]");

    // Registros filtrados por usuario referencia
    let tableEntriesRef = await geroSap.findById('wnd[0]/usr/tblSAPLZTESTJPG1TCTRL_ZTESTJPG1');
    let totalTableEntriesRef = tableEntriesRef.Columns.Item(1).Length.__value;
    msg.contentsRef = [];
    cont = 0;
    
    if (totalTableEntriesRef > 0) {
        // Guardado de entries en una lista
        for (let i = 0; i < totalTableEntriesRef; i++) {
            try {
                let content = tableEntriesRef.GetCell(i, 1).text.__value;
                if (!msg.contentsNew.includes(content)){
                    msg.contentsRef.push(content);
                }
                
                if (cont > 10) cont = 0, tableEntriesRef.VerticalScrollbar.Position(i);
                cont++;

            } catch (error) {

            }
        }
    } else {
        geroSap.setText('wnd[0]/tbar[0]/okcd', N);
        geroSap.sendKey('wnd[0]', 0);
        if (msg.result.code < 2) msg.result.code = 2;
        msg.result.description = msg.result.description + RESULTS_MESSAGES[11][1];
        return msg;
    }
    
    if (msg.contentsRef.length > 0){
        // New entries
        geroSap.press('wnd[0]/tbar[1]/btn[5]');

        // Set entries
        for (let i = 0; i < msg.contentsRef.length; i++) {
            geroSap.setText('wnd[0]/usr/tblSAPLZTESTJPG1TCTRL_ZTESTJPG1/txtZTESTJPG1-BNAME[0,' + i + ']', userNew);
            geroSap.setText('wnd[0]/usr/tblSAPLZTESTJPG1TCTRL_ZTESTJPG1/txtZTESTJPG1-ROL[1,' + i + ']', msg.contentsRef[i]);
        }
        geroSap.press('wnd[0]/tbar[0]/btn[11]');

        // Datos guardados o clave inválida
        const statusBar = await geroSap.findById('wnd[0]/sbar');
        const statusId = statusBar.MessageId.__value;
        const statusNumber = statusBar.MessageNumber.__value;

        if (statusId.trim() == STATUSID_SV && statusNumber == STATUSNUMBER_018) {
            geroSap.setText('wnd[0]/tbar[0]/okcd', N);
            geroSap.sendKey('wnd[0]', 0);
            msg.result.description = msg.result.description + RESULTS_MESSAGES[8][1];

        }

    } else {
        geroSap.setText('wnd[0]/tbar[0]/okcd', N);
        geroSap.sendKey('wnd[0]', 0);
        msg.result.description = msg.result.description + RESULTS_MESSAGES[12][1];
    }
    
}

return msg;
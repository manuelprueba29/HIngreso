const SPREADSHEET_IDD = "1g1ooF-btFbmVnc1W_RueL3RNasGaGacQSdTh66A9Nrg";

// Incluir archivos para uso en HTML
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Funciones relacionadas con la lógica de PagSecundaria
function getHistorialPorCedula(cedula) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_IDD);
  const registroSheet = ss.getSheetByName("RegistroIngreso");
  const data = registroSheet.getDataRange().getValues();
  Logger.log(data); // Verifica los datos obtenidos de la hoja
  const registros = data.filter((row) => row[1].toString() === cedula).map((row) => ({
    documento: row[1],
    nombre: row[2],
    jefeDirecto: row[3],
    fechaIngreso: row[4],
    horaIngreso: row[5],
  }));



  Logger.log(registros); // Verifica los registros filtrados
  // Retornar un array vacío si no hay registros
  if (registros.length === 0) {
    return [];
  }

  return registros;

  
}

function getHistorialPorCedulaYMes(cedula, mes) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_IDD);
  const registroSheet = ss.getSheetByName("RegistroIngreso");
  const data = registroSheet.getDataRange().getValues();

  const registros = data
    .map((row) => {
      row[4] = Utilities.formatDate(new Date(row[4]), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
      return row;
    })
    .filter(
      (row) =>
        row[1].toString() === cedula && row[4].startsWith(mes) // Columna E: FechaIngreso
    )
    .map((row) => ({
      documento: row[1],
      nombre: row[2],
      jefeDirecto: row[3],
      fechaIngreso: row[4],
      horaIngreso: row[5],
    }));

    // Retornar un array vacío si no hay registros
  if (registros.length === 0) {
    return [];
  }


  return registros;
}

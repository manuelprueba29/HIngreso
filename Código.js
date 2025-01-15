
const SPREADSHEET_ID="1g1ooF-btFbmVnc1W_RueL3RNasGaGacQSdTh66A9Nrg";

function doGet(e) {
  const page = e.parameter.page || 'PagPrincipal'; // Carga 'PagPrincipal' si no se especifica una página
  Logger.log(`Cargando la página: ${page}`);
  
  try {
    return HtmlService.createTemplateFromFile(page).evaluate()
      .setTitle('Sistema de Monitoreo')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (error) {
    Logger.log(`Error al cargar la página: ${error.message}`);
    return HtmlService.createHtmlOutput(`Error: La página "${page}" no existe.`);
  }
}


function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function registrarIngresogs(cedula) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID); // Reemplaza por el ID de tu hoja
  const empleadosSheet = ss.getSheetByName("Empleados");
  const registroSheet = ss.getSheetByName("RegistroIngreso");

  const empleadosData = empleadosSheet.getDataRange().getValues();
  const empleado = empleadosData.find(row => row[0].toString() === cedula); // Busca la cédula en la columna A (índice 0)

   // Validación para evitar duplicados
  const existe = registroSheet.getDataRange().getValues().some(row => row[1].toString() === cedula);
  if (existe) {
    throw new Error(`Ya existe un registro para la cédula ${cedula}.`);
  }

  if (empleado) {
    const [cedula, nombre, area, jefe] = empleado; // Extrae datos de la fila correspondiente
    const fechaIngreso = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"); // Fecha y hora actual
    const idSolicitud = Date.now(); // Genera un ID único basado en el timestamp

    // Agrega una nueva fila en RegistroIngreso
    registroSheet.appendRow([
      idSolicitud,
      cedula,
      nombre,
      jefe,
      fechaIngreso.split(' ')[0],
      fechaIngreso.split(' ')[1],
    ]);

    return `Ingreso registrado correctamente para ${nombre}.`;
  } else {
    throw new Error("Cédula no encontrada en la hoja de empleados.");
  }
}









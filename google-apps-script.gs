/** CODEX Portfolio inquiry receiver. Set NOTIFY_EMAIL to your preferred inbox. */
const NOTIFY_EMAIL = 'PUT_YOUR_EMAIL_HERE';
function doPost(e) {
  const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  const sheet = getOrCreateSheet_();
  sheet.appendRow([new Date(), data.name || '', data.phone || '', data.email || '', data.projectType || '', data.budget || '', data.details || '']);
  if (NOTIFY_EMAIL && NOTIFY_EMAIL.indexOf('PUT_YOUR_EMAIL') === -1) {
    const subject = 'New CODEX portfolio inquiry — ' + (data.name || 'Visitor');
    const body = 'Name: ' + (data.name || '') + '\nPhone: ' + (data.phone || '') + '\nEmail: ' + (data.email || 'Not provided') + '\nProject type: ' + (data.projectType || '') + '\nBudget: ' + (data.budget || '') + '\n\nDetails:\n' + (data.details || '');
    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
  }
  return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
}
function getOrCreateSheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('SHEET_ID');
  let ss;
  if (id) { ss = SpreadsheetApp.openById(id); }
  else { ss = SpreadsheetApp.create('CODEX Portfolio Inquiries'); props.setProperty('SHEET_ID', ss.getId()); }
  let sheet = ss.getSheetByName('Inquiries');
  if (!sheet) sheet = ss.insertSheet('Inquiries');
  if (sheet.getLastRow() === 0) sheet.appendRow(['Received At','Name','Phone','Email (optional)','Project Type','Budget','Details']);
  return sheet;
}

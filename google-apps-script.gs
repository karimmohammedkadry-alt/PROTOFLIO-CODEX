
/* =========================================
   CODEX PORTFOLIO INQUIRY RECEIVER
========================================= */

const CONFIG = {
  NOTIFY_EMAIL: 'YOUR_REAL_EMAIL@gmail.com',
  SPREADSHEET_NAME: 'CODEX Portfolio Inquiries',
  SHEET_NAME: 'Inquiries'
};

/* =========================================
   RECEIVE INQUIRY
========================================= */

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(15000);

    if (!e || !e.parameter) {
      throw new Error('No form data received.');
    }

    const data = e.parameter;

    const name = clean_(data.name);
    const phone = clean_(data.phone);
    const email = clean_(data.email);
    const projectType = clean_(data.projectType);
    const budget = clean_(data.budget);
    const details = clean_(data.details);

    if (!name || !phone || !projectType || !details) {
      throw new Error('Required fields are missing.');
    }

    const phoneDigits = phone.replace(/\D/g, '');

    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      throw new Error('Invalid phone number.');
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email address.');
    }

    const sheet = getOrCreateSheet_();

    sheet.appendRow([
      new Date(),
      safeCell_(name),
      safeCell_(phone),
      safeCell_(email),
      safeCell_(projectType),
      safeCell_(budget),
      safeCell_(details)
    ]);

    let emailSent = false;

    if (
      CONFIG.NOTIFY_EMAIL &&
      CONFIG.NOTIFY_EMAIL !== 'YOUR_REAL_EMAIL@gmail.com'
    ) {
      try {
        MailApp.sendEmail({
          to: CONFIG.NOTIFY_EMAIL,
          subject: 'New CODEX Portfolio Inquiry - ' + name,
          body:
            'New inquiry received from CODEX Portfolio.\n\n' +
            'Name: ' + name + '\n' +
            'Phone: ' + phone + '\n' +
            'Email: ' + (email || 'Not provided') + '\n' +
            'Project type: ' + projectType + '\n' +
            'Budget: ' + (budget || 'Not specified') + '\n\n' +
            'Project details:\n' + details
        });

        emailSent = true;

      } catch (emailError) {
        console.error('Email error:', emailError);
      }
    }

    return jsonResponse_({
      ok: true,
      saved: true,
      emailSent: emailSent,
      message: 'Inquiry saved successfully.'
    });

  } catch (error) {
    console.error('Inquiry error:', error);

    return jsonResponse_({
      ok: false,
      message: error.message || 'Unexpected server error.'
    });

  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

/* =========================================
   CREATE OR GET SPREADSHEET
========================================= */

function getOrCreateSheet_() {
  const props = PropertiesService.getScriptProperties();

  let spreadsheetId = props.getProperty('SHEET_ID');
  let spreadsheet;

  if (spreadsheetId) {
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);

  } else {
    spreadsheet = SpreadsheetApp.create(
      CONFIG.SPREADSHEET_NAME
    );

    spreadsheetId = spreadsheet.getId();

    props.setProperty('SHEET_ID', spreadsheetId);
  }

  let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Received At',
      'Name',
      'Phone',
      'Email',
      'Project Type',
      'Budget',
      'Details'
    ]);

    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    sheet.autoResizeColumns(1, 7);
  }

  return sheet;
}

/* =========================================
   CLEAN INPUT
========================================= */

function clean_(value) {
  return String(value || '')
    .trim()
    .slice(0, 4000);
}

/* =========================================
   PROTECT SPREADSHEET CELLS
========================================= */

function safeCell_(value) {
  const text = String(value || '');

  if (/^[=+\-@]/.test(text)) {
    return "'" + text;
  }

  return text;
}

/* =========================================
   JSON RESPONSE
========================================= */

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/* =========================================
   TEST SPREADSHEET CONNECTION
========================================= */

function testSpreadsheet() {
  const sheet = getOrCreateSheet_();

  Logger.log('Spreadsheet ready: ' + sheet.getParent().getUrl());
  Logger.log('Sheet name: ' + sheet.getName());
}

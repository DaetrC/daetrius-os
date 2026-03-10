// ============================================================
// DAETRIUS / DAYDRM Operating System
// Google Apps Script Backend — Code.gs
// Deploy as Web App: Execute as Me · Anyone with link
// ============================================================

const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// ── MAIN ROUTER ──
function doGet(e) {
  const action = e.parameter.action;
  const sheet = e.parameter.sheet;
  
  let result;
  
  switch(action) {
    case 'getSheet':
      result = getSheetData(sheet);
      break;
    case 'getAll':
      result = getAllData();
      break;
    case 'getKPIs':
      result = getKPIs();
      break;
    case 'getCountdown':
      result = getCountdown();
      break;
    default:
      result = { status: 'ok', message: 'DAETRIUS OS Backend running', timestamp: new Date().toISOString() };
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const { action, sheet, row, rowId } = data;
  
  let result;
  
  switch(action) {
    case 'addRow':
      result = addRow(sheet, row);
      break;
    case 'updateRow':
      result = updateRow(sheet, rowId, row);
      break;
    case 'deleteRow':
      result = deleteRow(sheet, rowId);
      break;
    case 'updateCell':
      result = updateCell(sheet, data.rowIndex, data.col, data.value);
      break;
    default:
      result = { status: 'error', message: 'Unknown action' };
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── SHEET DATA HELPERS ──
function getSheetData(sheetName) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return { status: 'error', message: `Sheet "${sheetName}" not found` };
    
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) return { status: 'ok', data: [] };
    
    const headers = data[0];
    const rows = data.slice(1).map((row, i) => {
      const obj = { _rowIndex: i + 2 };
      headers.forEach((h, j) => { obj[h] = row[j]; });
      return obj;
    });
    
    return { status: 'ok', data: rows };
  } catch(err) {
    return { status: 'error', message: err.toString() };
  }
}

function getAllData() {
  const sheets = [
    'strategy', 'phases', 'content_calendar', 'content_pipeline',
    'tasks', 'podcast_crm', 'fanforge', 'creative_artifacts',
    'budget', 'kpis', 'decisions', 'settings'
  ];
  
  const result = {};
  sheets.forEach(s => { result[s] = getSheetData(s); });
  result.timestamp = new Date().toISOString();
  result.countdown = getCountdown();
  return result;
}

function addRow(sheetName, row) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return { status: 'error', message: `Sheet "${sheetName}" not found` };
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const newRow = headers.map(h => row[h] || '');
    newRow[headers.indexOf('created_at')] = new Date().toISOString();
    
    sheet.appendRow(newRow);
    return { status: 'ok', message: 'Row added' };
  } catch(err) {
    return { status: 'error', message: err.toString() };
  }
}

function updateRow(sheetName, rowId, updates) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return { status: 'error', message: `Sheet not found` };
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Find row by ID column
    const idColIndex = headers.indexOf('id');
    let targetRow = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][idColIndex] == rowId) { targetRow = i + 1; break; }
    }
    
    if (targetRow === -1) return { status: 'error', message: 'Row not found' };
    
    Object.keys(updates).forEach(key => {
      const colIndex = headers.indexOf(key);
      if (colIndex !== -1) {
        sheet.getRange(targetRow, colIndex + 1).setValue(updates[key]);
      }
    });
    
    // Update updated_at if column exists
    const updatedAtCol = headers.indexOf('updated_at');
    if (updatedAtCol !== -1) {
      sheet.getRange(targetRow, updatedAtCol + 1).setValue(new Date().toISOString());
    }
    
    return { status: 'ok', message: 'Row updated' };
  } catch(err) {
    return { status: 'error', message: err.toString() };
  }
}

function deleteRow(sheetName, rowId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idColIndex = headers.indexOf('id');
    
    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i][idColIndex] == rowId) {
        sheet.deleteRow(i + 1);
        return { status: 'ok', message: 'Row deleted' };
      }
    }
    return { status: 'error', message: 'Row not found' };
  } catch(err) {
    return { status: 'error', message: err.toString() };
  }
}

function updateCell(sheetName, rowIndex, col, value) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const colIndex = headers.indexOf(col) + 1;
    if (colIndex === 0) return { status: 'error', message: `Column "${col}" not found` };
    sheet.getRange(rowIndex, colIndex).setValue(value);
    return { status: 'ok' };
  } catch(err) {
    return { status: 'error', message: err.toString() };
  }
}

// ── COUNTDOWN ──
function getCountdown() {
  const launch = new Date('2026-04-01T00:00:00');
  const now = new Date();
  const diffMs = launch - now;
  const days = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  return { days: days, launch_date: '2026-04-01', past_launch: diffMs < 0 };
}

// ── KPI SUMMARY ──
function getKPIs() {
  const kpiData = getSheetData('kpis');
  const summary = {};
  if (kpiData.status === 'ok') {
    kpiData.data.forEach(row => {
      if (!summary[row.metric_name] || new Date(row.date) > new Date(summary[row.metric_name].date)) {
        summary[row.metric_name] = row;
      }
    });
  }
  return { status: 'ok', data: summary };
}

// ── SCHEDULED TRIGGER: Daily sync ──
// Set this up in Apps Script Triggers: runs daily at midnight
function dailySync() {
  const log = {
    date: new Date().toISOString(),
    countdown: getCountdown(),
    status: 'synced'
  };
  Logger.log(JSON.stringify(log));
}

// ── SETUP: Create all sheets with proper headers ──
// Run this ONCE after creating your spreadsheet
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const schemas = {
    'strategy': ['id', 'section', 'title', 'content', 'last_updated', 'owner'],
    'phases': ['id', 'name', 'start_date', 'end_date', 'goal', 'status', 'completion_pct', 'owner', 'notes'],
    'content_calendar': ['id', 'date', 'time', 'title', 'content_type', 'platform', 'pillar', 'objective', 'cta', 'status', 'owner', 'linked_assets', 'publish_url', 'performance_notes', 'created_at'],
    'content_pipeline': ['id', 'title', 'concept', 'pillar', 'platform', 'campaign', 'owner', 'due_date', 'stage', 'priority', 'algorithm_train', 'notes', 'created_at', 'updated_at'],
    'tasks': ['id', 'week', 'task', 'phase', 'owner', 'due_date', 'status', 'priority', 'blockers', 'said_would_do', 'actually_did', 'notes'],
    'podcast_crm': ['id', 'outlet', 'host', 'category', 'audience_fit', 'reach_est', 'status', 'intro_source', 'pitch_angle', 'booked_date', 'release_date', 'follow_up_date', 'clip_potential', 'notes'],
    'fanforge': ['id', 'date', 'email_optins', 'sms_optins', 'smart_link_clicks', 'conversion_rate', 'source', 'audience_lane', 'cta_used', 'smart_link_url', 'organic_or_paid', 'notes'],
    'creative_artifacts': ['id', 'name', 'category', 'description', 'phase', 'status', 'budget', 'owner', 'linked_assets', 'notes', 'created_at'],
    'music_roadmap': ['id', 'item', 'type', 'phase', 'status', 'trigger_condition', 'collaborator', 'notes'],
    'budget': ['id', 'category', 'vendor', 'description', 'planned_budget', 'actual_spend', 'variance', 'due_date', 'paid_status', 'owner', 'priority', 'notes'],
    'kpis': ['id', 'date', 'metric_name', 'value', 'target_phase1', 'target_phase2', 'target_yearend', 'phase', 'notes'],
    'decisions': ['id', 'date', 'decision', 'context', 'owner', 'related_tab', 'status', 'due_date', 'notes'],
    'instagram_config': ['id', 'account', 'token', 'app_id', 'last_synced', 'status'],
    'settings': ['key', 'value', 'description', 'last_updated']
  };
  
  Object.keys(schemas).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    // Set headers
    const headers = schemas[sheetName];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Style header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1A1A1A');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(10);
  });
  
  Logger.log('All sheets created successfully');
}

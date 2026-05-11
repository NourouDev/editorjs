// Use standard Web Worker API
const workerCode = `
self.onmessage = (e) => {
  const { type, data } = e.data;

  if (type === 'validate') {
    try {
      JSON.parse(data);
      self.postMessage({ type: 'validate', success: true });
    } catch (error) {
      self.postMessage({
        type: 'validate',
        success: false,
        error: error.message,
        position: getErrorPosition(error, data)
      });
    }
  } else if (type === 'format') {
    try {
      const obj = JSON.parse(data);
      const formatted = JSON.stringify(obj, null, 2);
      self.postMessage({ type: 'format', success: true, formatted, _reqType: e.data._reqType });
    } catch (error) {
      self.postMessage({
        type: 'format',
        success: false,
        error: error.message,
        position: getErrorPosition(error, data),
        _reqType: e.data._reqType
      });
    }
  } else if (type === 'sort') {
    try {
      const obj = JSON.parse(data);
      const direction = e.data.direction || 'asc';
      const sortedObj = sortJson(obj, direction);
      const formatted = JSON.stringify(sortedObj, null, 2);
      self.postMessage({ type: 'sort', success: true, formatted, _reqType: e.data._reqType });
    } catch (error) {
      self.postMessage({
        type: 'sort',
        success: false,
        error: error.message,
        position: getErrorPosition(error, data),
        _reqType: e.data._reqType
      });
    }
  }
};

function sortJson(obj, direction) {
  if (Array.isArray(obj)) {
    return obj.map(item => sortJson(item, direction));
  } else if (obj !== null && typeof obj === 'object') {
    const keys = Object.keys(obj);
    keys.sort((a, b) => {
      if (direction === 'asc') return a.localeCompare(b);
      return b.localeCompare(a);
    });
    
    const sorted = {};
    for (const key of keys) {
      sorted[key] = sortJson(obj[key], direction);
    }
    return sorted;
  }
  return obj;
}

function getErrorPosition(error, text) {
  const positionMatch = error.message.match(/at position (\\d+)/);
  if (positionMatch) {
    const position = parseInt(positionMatch[1], 10);
    const lines = text.slice(0, position).split('\\n');
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    };
  }
  return null;
}
`;

export const createJsonWorker = () => {
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
};

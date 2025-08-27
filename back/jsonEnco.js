export function toPy(obj) {
  if (obj === null || obj === undefined) return null;

  if (Array.isArray(obj)) {
    return obj.map(toPy);
  }

  if (typeof obj === "object") {
    let out = {};
    for (const [key, value] of Object.entries(obj)) {
      out[key] = toPy(value);
    }
    return out;
  }

  // Handle numbers, strings, booleans
  return obj;
}

export function safeJsonResponse(res, payload, status = 200) {
  try {
    return res.status(status).json(payload);
  } catch (e) {
    // Fallback if payload has unserializable data
    try {
      return res.status(status).json(toPy(payload));
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Failed to serialize response", details: err.message });
    }
  }
}

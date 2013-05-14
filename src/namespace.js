var namespace = this.namespace = function(space, value, enableOverwrite) {
  var self = this, object = this, tokens = space.split("."), token, overwrite = false;

  if (typeof enableOverwrite !== 'undefined') {
    overwrite = Boolean(enableOverwrite);
  }

  while (tokens.length > 0) {
    token = tokens.shift();

    if (tokens.length > 0 && typeof object[token] !== 'object' && typeof object[token] !== 'function' && typeof object[token] !== "undefined") {
      if (self.console) {
        self.console.error('Namespace token "'+token+'" is not an object or function.');
      }
      return false;
    }

    if (typeof object[token] === "undefined") {
      if (typeof value === 'undefined') {
        return;
      }
      object[token] = tokens.length === 0 ? value : {};
    } else if(tokens.length === 0 && overwrite) {
      object[token] = value;
    }

    object = object[token];
  }

  return object;
};
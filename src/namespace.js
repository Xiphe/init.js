var namespace = this.namespace = function(space, value, overwrite) {
  var undef,
    token,
    self = this,
    object = self,
    undef_str = typeof undef,
    tokens = space.split('.');

  /* Turn off overwriting by default. */
  overwrite = (typeof overwrite !== undef_str ? overwrite : false);

  /* Loop through tokens. */
  while (tokens.length > 0) {
    token = tokens.shift();

    /*
     * If this is a middle token and is not capable to handle sub objects
     * throw an error and return undefined.
     */
    if (tokens.length > 0 &&
      typeof object[token] !== 'object' &&
      typeof object[token] !== 'function' &&
      typeof object[token] !== undef_str
    ) {
      if (self.console) {
        self.console.error('Namespace token "'+token+'" is not an object or function.');
      }
      return undef;
    }

    /* If the token is not defined jet... */
    if (typeof object[token] === undef_str) {
      /* And no value is passed... */
      if (typeof value === undef_str) {
        /* Stop looping and return undefined. */
        return undef;
      }

      /*
       * If this is a middle token, make it a new object.
       * If it is the last one - set the value.
       */
      object[token] = tokens.length === 0 ? value : {};
    }

    /* If this is the last token and, it is defined and overwriting is enabled. */
    else if(tokens.length === 0 && overwrite) {
      object[token] = value;
    }

    /* Get deeper. */
    object = object[token];
  }

  return object;
};
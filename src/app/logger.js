class Logger {
  constructor(verbose) {
    this.verbose = verbose;
  }

  info(message) {
    if (this.verbose == true) {
      console.log(message);
    }
  }
}

export default Logger;

var Logger = function(verbose){
  this.verbose = verbose;
}

Logger.prototype.info = function(message){
  if(this.verbose == true){
    console.log(message)
  }
}

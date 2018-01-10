export default {
    name: 'Postable',
    methods : {
        post(url,param,opt_success,opt_error) {
            switch(typeof opt_success){
                case 'string':
                opt_success = (res)=>{this.$router.push(opt_success)};
                break;
                case 'function':
                break;
                case 'undefined':
                default:
                opt_success = (res) => {};
                break;
            }
            if(typeof opt_error !== 'function') {
                opt_error = (error,statusCode) => {
                    this.handleServerError(error,statusCode);
                };
            }

            io.socket.post(url,param,(res,stat)=>{
                switch (stat.statusCode) {
                  case 200:
                  case 201:
                  opt_success(res);
                  return;
                  case 400:
                  case 403:
                  case 404:
                  case 500:
                  console.log(res);
                  opt_error(res,stat.statusCode);
                  return;
                  default:
                  console.log(stat.statusCode);
                  console.log(res);
                }
              });
        },
        handleServerError(error,statusCode) {
            console.warn(`handleError is not implemented. statusCode:${statusCode} error: ${error}`);
        }
    }
  }
#Readme
## Frontend backend protocols
### Request response specifications
* service list upload: /api/post_api_list
 * type: post
 * reques.body: json
 * response: json
* service status request: /api/get_service_status
 * type: get
 * response: json
* perform immediate test: /api/get_test_now
 * type: get
 * response: json
 
### Json files specifications
* Service and function
 * Service:
 
   ```javascript
{
  'name': String, 
  'url': String,
  'response type': String,
  'type': String, //request type, e.g. 'get' or 'post'
  'critical level': Integer //0 - 2, 0: high, 1: medium, 2: low
}
```
 * Function:
 
   ```javascript
{
  'name': String,
  'critical level': Integer,
  'services': [service objects]
}
```
* Service list
* Status report

## URLs
* http://pub.lmmp.nasa.gov:8083/getAzElfromT1/LTD002=Moon,-40.92187576334105,…0625036199669,1,1/Sun/2016-06-15T00:00:00.000/2016-06-16T00:00:00.000/1728 net::ERR_CONNECTION_REFUSED

* http://pub.lmmp.nasa.gov:8083/crossdomain.xml - net::ERR_CONNECTION_REFUSED 

   This error appears when using both the Marker Tool and the Info Bar Setting to calculate the sun angle.

* 50.18.111.140/crossdomain.xml:1 GET http://50.18.111.140/crossdomain.xml  net::ERR_CONNECTION_TIMED_OUT 


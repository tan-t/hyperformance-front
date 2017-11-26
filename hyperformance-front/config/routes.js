/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },


  'get /company/' : 'CompanyController.index',

  'get /company/:companyUrl': 'CompanyController.show',
  'post /company/create': 'CompanyController.create',
  'post /company/:companyUrl/update': 'CompanyController.update',
  'get /company/:companyUrl/member' : 'CompanyController.member',
  'get /company/:companyUrl/invitation' : 'CompanyController.invitation',

  'get /project/:projectUrl': 'ProjectController.show',
  'post /project/create': 'ProjectController.create',
  'post /project/:projectUrl/update': 'ProjectController.update',


  'get /company/:companyUrl/member/:id': 'CompanyMemberController.show',
  'get /company/:companyUrl/ismember': 'CompanyController.isMember',
  'post /company/:companyUrl/member/:id/update': 'CompanyMemberController.update',

  'get /project/:projectUrl/section/:id': 'SectionController.show',
  'post /company/:companyUrl/project/create': 'ProjectController.create',

  'post /company/:companyUrl/invite': 'InvitationController.inviteToCompany',

  'post /company/:companyUrl/join' : 'CompanyController.join'

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};

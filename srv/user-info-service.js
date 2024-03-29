module.exports = cds.service.impl(async function () {
    // API reference
    const api = 'xsuaa_api';

    // Get the XSUAA host URL from service binding
    const xsuaa_bind = JSON.parse(process.env.VCAP_SERVICES).xsuaa[0];
    const api_def = cds.env.requires[api];
    api_def.credentials.url = xsuaa_bind.credentials.url;

    // connect to the XSUAA host
    const xsuaa = await cds.connect.to(api_def);
    
    // using req.user approach (user attribute - of class cds.User - from the request object)
    this.on('userInfo', req => {
        const user = {
            id : req.user.id,
            tenant : req.user.tenant,
            _roles: req.user._roles,
            role_check : req.user.is('admin'),
            attr : req.user.attr.Region,
            roles : req.user.roles,
            logname : req.user.login_name,
            usrname : req.user.user_name,
            userdet : req.user,
            loginName : req.user.attr.user_name,
            logoname : "oo",
        }
        console.log("user_det: ", user);
        console.log("user_det2: ", req.user.attr);
        console.log("user_det3: ", req._req);
        return user;
    });

    // using the XSUAA API
    this.on('userInfoUAA', async () => {
        return await xsuaa.get("/userinfo");
    });
});
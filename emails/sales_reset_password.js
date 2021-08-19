const salesHost = require('./sales_host');
const socialMediaLinks = require('./social_links');
// let x = salesHost()

function salesResetPassword(name,email,tokenString){

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title></title>
        <style>
            /* CONFIG STYLES Please do not delete and edit CSS styles below */
            /* IMPORTANT THIS STYLES MUST BE ON FINAL EMAIL */
            #outlook a {
                padding: 0;
            }
    
            .ExternalClass {
                width: 100%;
            }
    
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
                line-height: 100%;
            }
    
            .es-button {
                mso-style-priority: 100 !important;
                text-decoration: none !important;
            }
    
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }
    
            .es-desk-hidden {
                display: none;
                float: left;
                overflow: hidden;
                width: 0;
                max-height: 0;
                line-height: 0;
                mso-hide: all;
            }
    
            [data-ogsb] .es-button {
                border-width: 0 !important;
                padding: 10px 20px 10px 20px !important;
            }
    
            /*
    END OF IMPORTANT
    */
            s {
                text-decoration: line-through;
            }
    
            html,
            body {
                width: 100%;
                font-family: tahoma, verdana, segoe, sans-serif;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
    
            table {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                border-collapse: collapse;
                border-spacing: 0px;
            }
    
            table td,
            html,
            body,
            .es-wrapper {
                padding: 0;
                Margin: 0;
            }
    
            .es-content,
            .es-header,
            .es-footer {
                table-layout: fixed !important;
                width: 100%;
            }
    
            img {
                display: block;
                border: 0;
                outline: none;
                text-decoration: none;
                -ms-interpolation-mode: bicubic;
            }
    
            table tr {
                border-collapse: collapse;
            }
    
            p,
            hr {
                Margin: 0;
            }
    
            h1,
            h2,
            h3,
            h4,
            h5 {
                Margin: 0;
                line-height: 120%;
                mso-line-height-rule: exactly;
                font-family: tahoma, verdana, segoe, sans-serif;
            }
    
            p,
            ul li,
            ol li,
            a {
                -webkit-text-size-adjust: none;
                -ms-text-size-adjust: none;
                mso-line-height-rule: exactly;
            }
    
            .es-left {
                float: left;
            }
    
            .es-right {
                float: right;
            }
    
            .es-p5 {
                padding: 5px;
            }
    
            .es-p5t {
                padding-top: 5px;
            }
    
            .es-p5b {
                padding-bottom: 5px;
            }
    
            .es-p5l {
                padding-left: 5px;
            }
    
            .es-p5r {
                padding-right: 5px;
            }
    
            .es-p10 {
                padding: 10px;
            }
    
            .es-p10t {
                padding-top: 10px;
            }
    
            .es-p10b {
                padding-bottom: 10px;
            }
    
            .es-p10l {
                padding-left: 10px;
            }
    
            .es-p10r {
                padding-right: 10px;
            }
    
            .es-p15 {
                padding: 15px;
            }
    
            .es-p15t {
                padding-top: 15px;
            }
    
            .es-p15b {
                padding-bottom: 15px;
            }
    
            .es-p15l {
                padding-left: 15px;
            }
    
            .es-p15r {
                padding-right: 15px;
            }
    
            .es-p20 {
                padding: 20px;
            }
    
            .es-p20t {
                padding-top: 20px;
            }
    
            .es-p20b {
                padding-bottom: 20px;
            }
    
            .es-p20l {
                padding-left: 20px;
            }
    
            .es-p20r {
                padding-right: 20px;
            }
    
            .es-p25 {
                padding: 25px;
            }
    
            .es-p25t {
                padding-top: 25px;
            }
    
            .es-p25b {
                padding-bottom: 25px;
            }
    
            .es-p25l {
                padding-left: 25px;
            }
    
            .es-p25r {
                padding-right: 25px;
            }
    
            .es-p30 {
                padding: 30px;
            }
    
            .es-p30t {
                padding-top: 30px;
            }
    
            .es-p30b {
                padding-bottom: 30px;
            }
    
            .es-p30l {
                padding-left: 30px;
            }
    
            .es-p30r {
                padding-right: 30px;
            }
    
            .es-p35 {
                padding: 35px;
            }
    
            .es-p35t {
                padding-top: 35px;
            }
    
            .es-p35b {
                padding-bottom: 35px;
            }
    
            .es-p35l {
                padding-left: 35px;
            }
    
            .es-p35r {
                padding-right: 35px;
            }
    
            .es-p40 {
                padding: 40px;
            }
    
            .es-p40t {
                padding-top: 40px;
            }
    
            .es-p40b {
                padding-bottom: 40px;
            }
    
            .es-p40l {
                padding-left: 40px;
            }
    
            .es-p40r {
                padding-right: 40px;
            }
    
            .es-menu td {
                border: 0;
            }
    
            .es-menu td a img {
                display: inline-block !important;
            }
    
            /* END CONFIG STYLES */
            a {
                text-decoration: underline;
            }
    
            h1 a {
                text-align: left;
            }
    
            h2 a {
                text-align: left;
            }
    
            h3 a {
                text-align: left;
            }
    
            p,
            ul li,
            ol li {
                font-family: tahoma, verdana, segoe, sans-serif;
                line-height: 150%;
            }
    
            ul li,
            ol li {
                Margin-bottom: 15px;
            }
    
            .es-menu td a {
                text-decoration: none;
                display: block;
            }
    
            .es-wrapper {
                width: 100%;
                height: 100%;
                background-image: ;
                background-repeat: repeat;
                background-position: center top;
                background-color: #e8e8e4;
            }
    
            .es-wrapper-color {
                background-color: #e8e8e4;
            }
    
            .es-header {
                background-color: transparent;
                background-image: ;
                background-repeat: repeat;
                background-position: center top;
            }
    
            .es-header-body {
                background-color: transparent;
            }
    
            .es-header-body p,
            .es-header-body ul li,
            .es-header-body ol li {
                color: #999999;
                font-size: 14px;
            }
    
            .es-header-body a {
                color: #999999;
                font-size: 14px;
            }
    
            .es-content-body {
                background-color: #ffffff;
            }
    
            .es-content-body p,
            .es-content-body ul li,
            .es-content-body ol li {
                color: #999999;
                font-size: 14px;
            }
    
            .es-content-body a {
                color: #02951e;
                font-size: 14px;
            }
    
            .es-footer {
                background-color: transparent;
                background-image: ;
                background-repeat: repeat;
                background-position: center top;
            }
    
            .es-footer-body {
                background-color: transparent;
            }
    
            .es-footer-body p,
            .es-footer-body ul li,
            .es-footer-body ol li {
                color: #989898;
                font-size: 14px;
            }
    
            .es-footer-body a {
                color: #989898;
                font-size: 14px;
            }
    
            .es-infoblock,
            .es-infoblock p,
            .es-infoblock ul li,
            .es-infoblock ol li {
                line-height: 120%;
                font-size: 12px;
                color: #999999;
            }
    
            .es-infoblock a {
                font-size: 12px;
                color: #999999;
            }
    
            h1 {
                font-size: 30px;
                font-style: normal;
                font-weight: normal;
                color: #333333;
            }
    
            h2 {
                font-size: 24px;
                font-style: normal;
                font-weight: normal;
                color: #333333;
            }
    
            h3 {
                font-size: 20px;
                font-style: normal;
                font-weight: normal;
                color: #333333;
            }
    
            .es-header-body h1 a,
            .es-content-body h1 a,
            .es-footer-body h1 a {
                font-size: 30px;
            }
    
            .es-header-body h2 a,
            .es-content-body h2 a,
            .es-footer-body h2 a {
                font-size: 24px;
            }
    
            .es-header-body h3 a,
            .es-content-body h3 a,
            .es-footer-body h3 a {
                font-size: 20px;
            }
    
            a.es-button,
            button.es-button {
                border-style: solid;
                border-color: #50b948;
                border-width: 10px 20px 10px 20px;
                display: inline-block;
                background: #50b948;
                border-radius: 4px;
                font-size: 16px;
                font-family: arial, 'helvetica neue', helvetica, sans-serif;
                font-weight: normal;
                font-style: normal;
                line-height: 120%;
                color: #ffffff;
                text-decoration: none;
                width: auto;
                text-align: center;
            }
    
            .es-button-border {
                border-style: solid solid solid solid;
                border-color: #50b948 #50b948 #50b948 #50b948;
                background: #2cb543;
                border-width: 0px 0px 0px 0px;
                display: inline-block;
                border-radius: 4px;
                width: auto;
            }
    
            /* RESPONSIVE STYLES Please do not delete and edit CSS styles below. If you don't need responsive layout, please delete this section. */
            @media only screen and (max-width: 600px) {
    
                p,
                ul li,
                ol li,
                a {
                    line-height: 150% !important;
                }
    
                h1 {
                    font-size: 30px !important;
                    text-align: center;
                    line-height: 120% !important;
                }
    
                h2 {
                    font-size: 26px !important;
                    text-align: center;
                    line-height: 120% !important;
                }
    
                h3 {
                    font-size: 20px !important;
                    text-align: center;
                    line-height: 120% !important;
                }
    
                h1 a {
                    text-align: center;
                }
    
                .es-header-body h1 a,
                .es-content-body h1 a,
                .es-footer-body h1 a {
                    font-size: 30px !important;
                }
    
                h2 a {
                    text-align: center;
                }
    
                .es-header-body h2 a,
                .es-content-body h2 a,
                .es-footer-body h2 a {
                    font-size: 24px !important;
                }
    
                h3 a {
                    text-align: center;
                }
    
                .es-header-body h3 a,
                .es-content-body h3 a,
                .es-footer-body h3 a {
                    font-size: 20px !important;
                }
    
                .es-menu td a {
                    font-size: 16px !important;
                }
    
                .es-header-body p,
                .es-header-body ul li,
                .es-header-body ol li,
                .es-header-body a {
                    font-size: 16px !important;
                }
    
                .es-content-body p,
                .es-content-body ul li,
                .es-content-body ol li,
                .es-content-body a {
                    font-size: 16px !important;
                }
    
                .es-footer-body p,
                .es-footer-body ul li,
                .es-footer-body ol li,
                .es-footer-body a {
                    font-size: 16px !important;
                }
    
                .es-infoblock p,
                .es-infoblock ul li,
                .es-infoblock ol li,
                .es-infoblock a {
                    font-size: 12px !important;
                }
    
                *[class="gmail-fix"] {
                    display: none !important;
                }
    
                .es-m-txt-c,
                .es-m-txt-c h1,
                .es-m-txt-c h2,
                .es-m-txt-c h3 {
                    text-align: center !important;
                }
    
                .es-m-txt-r,
                .es-m-txt-r h1,
                .es-m-txt-r h2,
                .es-m-txt-r h3 {
                    text-align: right !important;
                }
    
                .es-m-txt-l,
                .es-m-txt-l h1,
                .es-m-txt-l h2,
                .es-m-txt-l h3 {
                    text-align: left !important;
                }
    
                .es-m-txt-r img,
                .es-m-txt-c img,
                .es-m-txt-l img {
                    display: inline !important;
                }
    
                .es-button-border {
                    display: block !important;
                }
    
                a.es-button,
                button.es-button {
                    font-size: 20px !important;
                    display: block !important;
                    border-width: 10px 0px 10px 0px !important;
                }
    
                .es-btn-fw {
                    border-width: 10px 0px !important;
                    text-align: center !important;
                }
    
                .es-adaptive table,
                .es-btn-fw,
                .es-btn-fw-brdr,
                .es-left,
                .es-right {
                    width: 100% !important;
                }
    
                .es-content table,
                .es-header table,
                .es-footer table,
                .es-content,
                .es-footer,
                .es-header {
                    width: 100% !important;
                    max-width: 600px !important;
                }
    
                .es-adapt-td {
                    display: block !important;
                    width: 100% !important;
                }
    
                .adapt-img {
                    width: 100% !important;
                    height: auto !important;
                }
    
                .es-m-p0 {
                    padding: 0px !important;
                }
    
                .es-m-p0r {
                    padding-right: 0px !important;
                }
    
                .es-m-p0l {
                    padding-left: 0px !important;
                }
    
                .es-m-p0t {
                    padding-top: 0px !important;
                }
    
                .es-m-p0b {
                    padding-bottom: 0 !important;
                }
    
                .es-m-p20b {
                    padding-bottom: 20px !important;
                }
    
                .es-mobile-hidden,
                .es-hidden {
                    display: none !important;
                }
    
                tr.es-desk-hidden,
                td.es-desk-hidden,
                table.es-desk-hidden {
                    width: auto !important;
                    overflow: visible !important;
                    float: none !important;
                    max-height: inherit !important;
                    line-height: inherit !important;
                }
    
                tr.es-desk-hidden {
                    display: table-row !important;
                }
    
                table.es-desk-hidden {
                    display: table !important;
                }
    
                td.es-desk-menu-hidden {
                    display: table-cell !important;
                }
    
                .es-menu td {
                    width: 1% !important;
                }
    
                table.es-table-not-adapt,
                .esd-block-html table {
                    width: auto !important;
                }
    
                table.es-social {
                    display: inline-block !important;
                }
    
                table.es-social td {
                    display: inline-block !important;
                }
    
                img {
                    max-width: 100%;
                    height: auto;
                    object-fit: cover;
                }
            }
    
            /* END RESPONSIVE STYLES */
        </style>
        <!--[if (mso 16)]>
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]-->
        <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
        <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG></o:AllowPNG>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    </head>
    
    <body>
        <div class="es-wrapper-color">
            <!--[if gte mso 9]>
                <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                    <v:fill type="tile" color="#e8e8e4"></v:fill>
                </v:background>
            <![endif]-->
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                    <tr>
                        <td class="esd-email-paddings" valign="top">
                            <table class="es-header esd-header-popover" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" esd-custom-block-id="88635" style="background-color: #000000;" bgcolor="#000000" align="center">
                                            <table class="es-header-body" style="background-color: #000000;" width="600" cellspacing="0" cellpadding="0" bgcolor="#000000" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p10t es-p20b es-p15r es-p15l" esd-general-paddings-checked="false" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="570" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-image" style="font-size: 0px;" align="center"><a target="_blank"><img class="adapt-img" src="https://liiueu.stripocdn.email/content/guids/824d24ad-c799-4852-9a7b-0f149e1a4cbb/images/28481619431982683.png" alt style="display: block;" height="82"></a></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" align="center">
                                            <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="es-p20t es-p20r es-p20l esd-structure" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="560" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-text" align="center">
                                                                                            <h3 style="color: #6fd20d; font-weight:540; font-size:xx-large">Reset Your Password</h3>
                                                                                            <p style="color: #000000;"><br></p>
                                                                                            <p style="text-align: left; color: #000000; font-size: medium;">Dear ${name},<br><br></p>
                                                                                            <p style="color: #000000; font-size: medium;">&nbsp; Someone (hopefully you) requested to reset your password, please kindly click on the button below to do so</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-button es-m-txt-c" bgcolor="#ffffff" align="center"><br><br><br><span class="es-button-border" style="border-radius: 8px; background: #6fd20d; border-color: #50b948;"><a href="${salesHost()}/reset/?email=${email}&token=${tokenString}" class="es-button" target="_blank" style="color: #000000; border-radius: 8px; font-weight: bold; font-size: 18px; font-family: arial, &quot;helvetica neue&quot;, helvetica, sans-serif; border-left-width: 20px; border-right-width: 20px; background: #6fd20d; border-color: #6fd20d;">Reset Password</a></span></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-text" bgcolor="#ffffff" align="left">
                                                                                            <p style="color: #000000; line-height: 200%; font-size:medium;">If that doesn't work, Copy and paste the link below to your browser.</p><br><a href="${salesHost()}/reset/?email=${email}&token=${tokenString}" style="font-size:medium;" target="_blank">${salesHost()}/reset/?email=${email}&token=${tokenString}</a><br><br>Please kindly ignore if you did not request for this action<br><br>
                                                                                            <p style="color: #000000; line-height: 100%; font-size:medium;">If you have any questions, just reply to this email, we are always happy to help out.<br><br><br><br></p>
                                                                                            <p style="color: #000000; line-height: 100%; font-size:medium;">Cheers,<br>The Excite Team<br><br></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-text es-p5" esd-links-color="#000" bgcolor="#f5f2f6" align="center"><br>
                                                                                            <p style="color: black; font-weight: 600;">Need More Help?<br><a href style="color: #000000;">We are here,ready to talk</a></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr></tr>
                                    <tr>
                                        <td class="esd-stripe" esd-custom-block-id="8126" style="background-color: #ffffff;" bgcolor="#ffffff" align="center">
                                            <table class="es-content-body" style="background-color: #ffffff;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="600" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody></tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="es-footer" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" esd-custom-block-id="3511" style="background-color: #ffffff;" bgcolor="#ffffff" align="center">
                                            <table class="es-footer-body" style="background-color: #000000;" width="600" cellspacing="0" cellpadding="0" bgcolor="#000" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p30t es-p30r es-p30l" esd-general-paddings-checked="false" style="background-color: #6fd20d;" bgcolor="#6fd20d" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="540" valign="top" align="center"> ${socialMediaLinks()} <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-text" align="center">
                                                                                            <p style="color: #ffffff;">You received this email because you just&nbsp; requested to reset your account on the excite enterprise platform</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-text es-p15t es-p5b" bgcolor="#6fd20d" align="center">
                                                                                            <p style="color: #ffffff;">© Excite Inc.</p>
                                                                                            <p style="color: #ffffff;">3,&nbsp; Dapo Bode Street Yaba Phase 2 Lagos, Nigeria</p>
                                                                                            <p style="color: #ffffff;">Company Number: 07012345<br>Company Email:enquiry@exciteafrica.com</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-text" esd-links-color="#ffffff" esd-links-underline="underline" bgcolor="#6fd20d" align="center"><br>
                                                                                            <p style="color: #ffffff;"><a href="https://www.exciteenterprise.com/privacy" target="_blank" style="color: #ffffff; text-decoration: underline;">excite privacy policy</a></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr></tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="esd-footer-popover es-content" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" style="background-color: #ffffff;" bgcolor="#ffffff" align="center">
                                            <table class="es-content-body" style="background-color: #ffffff;" width="600" cellspacing="0" cellpadding="0" bgcolor="#fff" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p30t es-p30b es-p20r es-p20l" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="560" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-image" style="font-size: 0px;" align="center"><a target="_blank"><img class="adapt-img" src="https://liiueu.stripocdn.email/content/guids/824d24ad-c799-4852-9a7b-0f149e1a4cbb/images/15671619429660563.png" alt style="display: block;" height="82"></a></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
    
    </html>`
}

module.exports = salesResetPassword
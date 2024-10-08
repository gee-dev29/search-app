export const resetPasswordTemplate = (token, name) => {
    return `
       <head>
         <meta name="viewport" content="width=device-width">
         <meta http-equiv="content-type" content="text/html; charset=UTF-8">
         <title>Password Reset</title>
         <link href="styles.css" rel="stylesheet" type="text/css">
         
       <style type="text/css">
             *{
                 margin:0;
                 font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;
                 box-sizing:border-box;
                 font-size:14px;
             }
             img{
                 max-width:100%;
             }
             body{
                 -webkit-font-smoothing:antialiased;
                 -webkit-text-size-adjust:none;
                 width:100% !important;
                 height:100%;
                 line-height:1.6em;
             }
             table td{
                 vertical-align:top;
             }
             .logo-header{
                 font-size:16px;
                 color:#fff;
                 background-color:#2692D5;
                 font-weight:500;
                 padding:20px;
                 text-align:center;
                 border-radius:3px 3px 0 0;
             }
             body{
                 background-color:#f6f6f6;
             }
             .body-wrap{
                 background-color:#f6f6f6;
                 width:100%;
             }
             .container{
                 display:block !important;
                 max-width:600px !important;
                 margin:0 auto !important;
                 clear:both !important;
             }
             .content{
                 max-width:600px;
                 margin:0 auto;
                 display:block;
                 padding:20px;
             }
             .main{
                 background-color:#fff;
                 border:1px solid #e9e9e9;
                 border-radius:3px;
             }
             .content-wrap{
                 padding:20px;
             }
             .content-block{
                 text-align:center;
                 padding:0 0 40px;
             }
             .message{
                 border-bottom:1px solid #eee;
                 margin-bottom:40px;
                 display:block;
             }
             .footer{
                 width:100%;
                 clear:both;
                 color:#999;
                 padding:20px;
             }
             .footer p,.footer a,.footer td{
                 color:#999;
                 font-size:12px;
             }
             h1,h2,h3{
                 font-family:"Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;
                 color:#000;
                 margin:20px 0 0;
                 line-height:1.2em;
                 font-weight:400;
             }
             h1{
                 font-size:32px;
                 font-weight:500;
             }
             h2{
                 font-size:24px;
             }
             h3{
                 font-size:18px;
             }
             h4{
                 font-size:14px;
                 font-weight:600;
             }
             p,ul,ol{
                 margin-bottom:10px;
                 font-weight:normal;
             }
             p li,ul li,ol li{
                 margin-left:5px;
                 list-style-position:inside;
             }
             a{
                 color:#2692D5;
                 text-decoration:underline;
             }
             .btn{
                 text-decoration:none;
                 color:#FFF;
                 line-height:2em;
                 font-weight:bold;
                 text-align:center;
                 cursor:pointer;
                 display:inline-block;
                 border-radius:5px;
                 text-transform:capitalize;
             }
             .btn-primary{
                 background-color:#2692D5;
                 border:solid #2692D5;
                 border-width:10px 20px;
             }
             .btn-default{
                 background-color:#999;
                 border:solid #999;
                 border-width:10px 20px;
             }
             .last{
                 margin-bottom:0;
             }
             .first{
                 margin-top:0;
             }
             .aligncenter{
                 text-align:center;
             }
             .alignright{
                 text-align:right;
             }
             .alignleft{
                 text-align:left;
             }
             .clear{
                 clear:both;
             }
             .alert{
                 font-size:16px;
                 color:#fff;
                 font-weight:500;
                 padding:20px;
                 text-align:center;
                 border-radius:3px 3px 0 0;
             }
             .alert h1,.alert h2,.alert h3{
                 color:#fff;
                 font-weight:600;
                 margin:0;
             }
             .alert a{
                 color:#fff;
                 text-decoration:none;
                 font-weight:500;
                 font-size:16px;
             }
             .alert.alert-warning{
                 background-color:#FFB204;
             }
             .alert.alert-bad{
                 background-color:#D0021B;
             }
             .alert.alert-good{
                 background-color:#68B90F;
             }
             .oc-table{
                 text-align:left;
                 width:100%;
             }
             .oc-table td{
                 padding:5px 0;
             }
             .oc-table .oc-table-items{
                 width:100%;
             }
             .oc-table .oc-table-items td{
                 border-top:#eee 1px solid;
             }
             .oc-table .subtotal td{
                 border-top:2px solid #333;
             }
             .oc-table .total td{
                 border-bottom:2px solid #333;
                 font-weight:700;
             }
             .oc-table .condensed-table-items *{
                 font-size:12px;
                 width:100%;
             }
             .oc-table .condensed-table-items th{
                 border-top:1px solid #eee;
                 border-bottom:1px solid #eee;
                 padding:0 5px;
             }
             .oc-table .condensed-table-items td{
                 padding:0 5px;
             }
         @media only screen and (max-width: 640px){
             body{
                 padding:0 !important;
             }
     
     }	@media only screen and (max-width: 640px){
             h1,h2,h3,h4{
                 font-weight:800 !important;
                 margin:20px 0 5px !important;
             }
     
     }	@media only screen and (max-width: 640px){
             h1{
                 font-size:22px !important;
             }
     
     }	@media only screen and (max-width: 640px){
             h2{
                 font-size:18px !important;
             }
     
     }	@media only screen and (max-width: 640px){
             h3{
                 font-size:16px !important;
             }
     
     }	@media only screen and (max-width: 640px){
             .container{
                 padding:0 !important;
                 width:100% !important;
             }
     
     }	@media only screen and (max-width: 640px){
             .content{
                 padding:0 !important;
             }
     
     }	@media only screen and (max-width: 640px){
             .content-wrap{
                 padding:10px !important;
             }
     
     }	@media only screen and (max-width: 640px){
             .content-block{
                 padding:0 0 20px;
                 margin-bottom:20px;
             }
     
     }	@media only screen and (max-width: 640px){
             .oc-table{
                 width:100% !important;
             }
     
     }</style></head>
       <body itemscope="" itemtype="http://schema.org/EmailMessage">
         <table class="body-wrap">
           <tr>
             <td>
             </td>
             <td class="container" width="600">
               <div class="content">
                 <table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope="" itemtype="http://schema.org/ConfirmAction">
                   <tr>
                     <td class="content-wrap">
                       <meta itemprop="name" content="Confirm Email">
                       <table width="100%" cellpadding="0" cellspacing="0">
                         <tr>
                           <td class="content-block">
                             <h2>Username: ${name}
                             </h2>
                               <a href="https://app.evercaringinc.com/reset-password?code=${token}">Click to Reset Password</a>
                           </td>
                         </tr>
                       </table>
                     </td>
                   </tr>
                 </table>
                 <div class="footer">
                   <table width="100%">
                     <tr>
                       <td class="aligncenter content-block">Powered by <a href="#">Four51 OrderCloud™</a>
                     </td>
                   </tr>
                 </table>
               </div>
             </div>
           </td>
           <td>
           </td>
         </tr>
       </table>
     </body>`;
};

export default resetPasswordTemplate;
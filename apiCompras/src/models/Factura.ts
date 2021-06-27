'use strict';

import { getTextFactura } from "./GeneradorFactura";
import { Transaccion } from "./Transaccion";

const nodemailer = require("nodemailer");

export class Factura{

    async generarFactura(transaccion:Transaccion, cliente:string, libro:string): Promise<Boolean>{
        var html_to_pdf = require('html-pdf-node');
        let options = { format: 'A4' };
        const fs = require('fs');

        
        const factura:string = getTextFactura(transaccion, cliente, libro);
        let file = { content: factura };
        html_to_pdf.generatePdf(file, options).then((pdfBuffer: any) => {
            let mailDetails = {
                from: "booksa@noreply.com",
                to: "usac.proyectos.2021@gmail.com",
                subject: "Factura de Compra de Libro",
                html: "<center><h2>Gracias por su compra!!</h2></center><h4>Adjunto, encontrará su factura.</h4>",
                attachments: [
                    {   // binary buffer as an attachment
                        filename: 'Factura.pdf',
                        content: pdfBuffer
                    }
                ]
            };

            let mailTransporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user:"usac.proyectos.2021@gmail.com",
                    pass: "Abc123**",
                },
            });

            mailTransporter.sendMail(mailDetails, function (err:any, data:any) {
                if (err) {
                    console.log("Error Occurs", err);
                } else {
                    console.log("Email sent successfully");
                }
            });

            // fs.writeFile('factura.pdf', pdfBuffer, (err:any) => {
            //     if (err) throw err;
            //     console.log('PDF Saved!');
            // });
        });
        return true;
    }
}


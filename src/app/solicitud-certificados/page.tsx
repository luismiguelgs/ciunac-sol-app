import VerificacionEmail from '@/components/verificacion-email'
import FormEmailSolicitud from '@/modules/solicitud-certificado/components/form-email'
import React from 'react'

export default function SolicitudCertificadoPage() {
	return (
		<div className="p-4">
             <h2 className="text-2xl font-bold uppercase text-center mb-6">
                Verificación de correo electrónico
            </h2>
			
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
				<VerificacionEmail />

                {/* Right Column */}
				<FormEmailSolicitud />
			</div>
		</div>
	)
}

import Isolicitud from "@/interfaces/solicitud.interface";
import { Itexto } from "@/interfaces/types.interface";
import SolicitudesService from "@/services/solicitudes.service";
import TypesService from "@/services/types.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HourglassIcon, CheckCircleIcon, ThumbsUpIcon } from "lucide-react"
import Image from "next/image"
import procesoUno from "@/assets/2.png"
import procesoDos from "@/assets/3.png"
import Download from "./donwload";

async function getRequests(dni:string){
    try {
        const res = await SolicitudesService.searchItemByDni(dni) as Isolicitud[];
        return res;
    } catch (error) {
        console.error('Error fetching requests:', error);
        return [];
    }
}
async function getTextos(){
    try {
        const res = await TypesService.fetchTypes<Itexto>('textos') as Itexto[];
        return res;
    } catch (error) {
        console.error('Error fetching textos:', error);
        return [];
    }
}

export default async function ResultadoSolicitudPage({ params }: { params: { dni: string } }) {
    const {dni} = await params;
    const requests = await getRequests(dni);
    const textos = await getTextos();

    return (
        <main className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center bg-slate-100 dark:bg-slate-900">
            <div className="w-full max-w-md p-4 md:max-w-4xl lg:max-w-5xl">
                {requests && requests.length > 0 && (
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/2 space-y-4">
                            <h1 className="text-3xl font-bold text-center md:text-left text-primary">
                                Consulta del Estado de su Solicitud
                            </h1>
                            <h2 className="text-2xl font-bold text-center md:text-left">
                                {`${requests[0].apellidos} ${requests[0].nombres}`}
                            </h2>
                            <p className="text-muted-foreground text-center md:text-left">DNI: {dni}</p>
                            {textos && (
                                <Alert>
                                    <AlertDescription>
                                        {textos.find(objeto => objeto.titulo === 'texto_ubicacion_5')?.texto}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <Alert className="mt-4">
                                <AlertDescription>
                                    Haga clic en el icono PDF o el botón para descargar su cargo. Presente este cargo junto con su DNI en la oficina.<br/><br/>
                                    Para consultas:<br/>
                                    📧 ciunac.certificados@unac.edu.pe<br/>
                                    📞 014291931<br/>
                                    ⏰ Lunes a Viernes: 8:30 AM - 1:00 PM y 2:00 PM - 4:00 PM
                                </AlertDescription>
                            </Alert>
                        </div>
                        <div className="md:w-1/2 space-y-4">
                            {requests.map((item) => (
                                <Card key={item.id}>
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <Avatar>
                                            <AvatarFallback>
                                                {item.estado === 'NUEVO' ? (
                                                    <HourglassIcon className="h-4 w-4 text-blue-500" />
                                                ) : item.estado === 'ELABORADO' ? (
                                                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <ThumbsUpIcon className="h-4 w-4" />
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col w-full gap-1">
                                            <p className="text-sm font-medium">{item.tipo_solicitud}</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-base text-muted-foreground">
                                                    {item.creado? new Date(item.creado as string).toLocaleDateString('es-ES'): ''}
                                                </p>
                                                <p className="text-md text-muted-foreground">
                                                    Idioma: <span className="font-medium">{item.idioma}</span>{' '}
                                                    Nivel: <span className="font-medium">{item.nivel}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    {item.estado === 'NUEVO' ? (
                                        <div className="relative h-[80px] w-full">
                                            <Image
                                                src={procesoUno}
                                                alt="Proceso"
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-contain"
                                            />
                                        </div>
                                    ) : item.estado === 'ELABORADO' ? (
                                        <div className="relative h-[80px] w-full">
                                            <Image
                                                src={procesoDos}
                                                alt="Proceso2"
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-contain"
                                            />
                                        </div>
                                    ) : null}
                                    <CardContent>
                                        {textos && <Download item={item} textos={textos} />}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}

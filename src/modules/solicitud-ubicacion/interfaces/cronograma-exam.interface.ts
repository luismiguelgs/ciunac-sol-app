export default interface IcronogramaExam {
    id?: string;
    period: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    date: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createAt: any;
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateAt: any;
    active: boolean;
    isNew?: boolean;
}

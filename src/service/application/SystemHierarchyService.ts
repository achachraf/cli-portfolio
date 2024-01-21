export default interface SystemHierarchyService {

    list(path: string, options: string[]): FileDesc[]

    exists(path: string): boolean
}
export function matcher(pattern: boolean): (data: any) => boolean {
    return (data: any) => (typeof data === 'boolean') && (data === pattern)
}
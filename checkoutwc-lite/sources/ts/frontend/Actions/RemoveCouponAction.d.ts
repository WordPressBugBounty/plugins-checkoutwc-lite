import Action from './Action';
/**
 *
 */
declare class RemoveCouponAction extends Action {
    /**
     */
    constructor();
    /**
     *
     * @param resp
     */
    response(resp: any): void;
    /**
     * @param xhr
     * @param textStatus
     * @param errorThrown
     */
    error(xhr: any, textStatus: string, errorThrown: string): void;
}
export default RemoveCouponAction;

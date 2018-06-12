'use strict'

const storemodel = use('App/Models/StoreInfo')
const Database = use('Database')

class AddstoreController {
    async index({auth,session,response,request,view}){

        const storeifon = await storemodel.all();
        const storeinfo = storeifon.toJSON();
        return view.render('hiaudrey.addstoreindex',{
            storeinfo:storeinfo
        })
    }

    //新增門市進資料庫
    async add({session,response,request,view}){
        const store_area_distinct = await Database.select('store_area').from('store_infos').distinct('store_area')
        const reserve_time = await Database.select('can_reserve_time').from('timeID')
        
        return view.render('hiaudrey.addstorepage',{
            store_area:store_area_distinct,
            reserve_time:reserve_time
        })
    }

    //將資料塞進DB
    async create({request,response,view,session}){
        const data = request.only([
            'store_area',
            'store_name',
            'sotre_address',
            'store_phone',
            'can_reserve_time',
            'time_id',
            'store_num'
        ]);
        await storemodel.create(data)
        session.flash({ notificationSU:'新增成功' })        
        return response.redirect('/AudreySP/addStoreindex')
    }
    //刪除資料
    async delete({params,session,response}){
        const del = await storemodel.find(params.id);
        await del.delete()
        session.flash({ notification:'刪除成功' })        
        return response.redirect('/AudreySP/addStoreindex')
    }

    //ajax 取得time_id
    async ajaTimeid({request}){
        const data = request.all().store_name;
        const time_id = await Database.select('id').from('timeID').where('can_reserve_time',data);
        return time_id
    }
}


module.exports = AddstoreController

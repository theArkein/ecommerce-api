module.exports = (role, permission, entity)=>{
    return (req, res, next)=>{
        let admin = req.admin

        console.log(`AdminRole: ${admin.adminRole}`)
        if(role && admin.adminRole!=role)
        return res.json({
            success: false,
            message: `${admin.adminRole} is not authorized for this operation`
        })

        if(admin.adminRole!="STAFF")
        return next()

        if(!(admin.adminPermissions.includes(permission) && admin.permittedEntities.includes(entity)))
            return res.json({
                success: false,
                message: `You are not authorized to ${(permission)} ${entity}`
            })

        return next()
    }
}
/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    let settings = app.settings()

    settings.meta.appName = "1aa888f8-2ed0-47a3-84f2-65ce39996103.app-preview.com"
    settings.meta.appURL = "https://1aa888f8-2ed0-47a3-84f2-65ce39996103.app-preview.com/hcgi/platform"
    settings.meta.hideControls = true

    settings.logs.maxDays = 7
    settings.logs.minLevel = 8
    settings.logs.logIP = true
    
    settings.trustedProxy.headers = [
        "X-Real-IP",
        "X-Forwarded-For",
        "CF-Connecting-IP",
    ]

    app.save(settings)
})

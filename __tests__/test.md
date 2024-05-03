# 1
### configs: 
    maxConcurrent: 20,
    minTime: 200,
### result: 
    loops: 20
    scrapped links: 1852
    total time spent:  746063ms or 746s or 12.4 min
        more info:
            ~2.5 links in 1 sec
            ~149.4 links in 1 min
            errors: 1748 links or ~ 49%

    next 20 loops:
        ~2 links in 1 sec

# 2

### configs: 
    maxConcurrent: 10,
    minTime: 333,
### result=
    loops: 20
    scrapped links: 3416
    total time spent: 1226821ms or  1227s or 20,4 min
        more info:
            ~2.78 links in 1 sec
            ~167.4 links in 1 min
            errors: 184 links or ~ 5.1%

    next: 20
    scrapped links: 2455
    total time spent: 1222495ms or 1222s or 20.3 min
        more info:
            ~2 links in 1 sec
            ~120.9 links in 1 min
            errors: 1145 links or ~ 31.8%

    total for 40:
        scrapped links: 5871
        total time spent: 2449s
        more info:
            ~2.39 links in 1 sec
            errors: 1329



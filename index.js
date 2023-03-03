const puppeteer = require("puppeteer");

(async () => {
    //inicializar el navegador, darle headless false para que se vea el ingreso a la pag
    const browser = await puppeteer.launch({ headless: true });
    //crear una nueva ventana
    const page = await browser.newPage();
    //indicar la ruta a la que se va a acceder
    await page.goto('https://www.amazon.com');
    //obtener el titulo de la pagina
    //const title = await page.title();
    //empezar a escribir en el campo de texto de la busqueda para ello obtener el id, luego darle el texto
    await page.type('#twotabsearchtextbox', 'libros de javascript')
    //luego una vez escribe damos click en el boton del buscador para iniciar la busqueda
    await page.click('.nav-search-submit input')
    //esperar por clases anidadas
    //await page.click('.nav-search-submit.nav-sprite>#nav-search-submit-text>input')
    //despues de dar click espera por la navegacion o espera a que cargue un componente en especifico
    //await page.waitForNavigation()
    //esperar por selector de componente
    await page.waitForSelector('[data-component-type=s-search-result]')
    //tiempo de espera
    await page.waitForTimeout(2000)
    //investigar dentro de la pagina, evaluate recibe una funcion anonima y dentro se le da 
    //javascript puro para interaccionar con la pagina en este caso se va a extraer el enlace de cada pagina
    const allLinks = await page.evaluate(()=>{
        const enlaces = document.querySelectorAll('.a-section.a-spacing-none>h2>a')

        const links = [];
        for(enlace of enlaces){
            links.push(enlace.href)
        }
        return links
    })
    console.log(allLinks)
    console.log(allLinks.length)
    //ahora para recorrer cada uno de los enlaces y empezar a extraer info especifica de cada uno
    const libros = []
    for(link of allLinks){
        await page.goto(link)
        await page.waitForSelector('#productTitle')
        const url = link
        const libro = await page.evaluate(()=>{
            const data = {}
            data.titulo = document.querySelector('#productTitle').innerText
            data.autor = document.querySelector('.author a').innerText
            data.precio = document.querySelector('.a-span-last span').innerText
            data.califica = document.querySelector('[class*=a-icon-star]>.a-icon-alt').innerText
            return data
        })
        libro.url = url
        libros.push(libro)
    }
    console.log(libros)

    //esperar por clase especifica
    //await page.waitForSelector('.rush-component.s-latency-cf-section')
    //obtener el titulo
    //const title = await page.title();
    //console.log(title)
    //interactuar con el buscador y escribir algo en el
    //await page.type()
    //tomar un pantallazo de esa ruta en ese momento
    //await page.screenshot({ path: 'example2.png' });
    //cerrar el navegador creado
    await browser.close();
  })();
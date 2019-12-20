export default {
    methods: {
        translit(from) {
            let rusChars = new Array('а','б','в','г','д','е','ё','ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ч','ц','ш','щ','э','ю','я','ы','ъ','ь', ' ', '\'', '\"', '\#', '\$', '\%', '\&', '\*', '\,', '\:', '\;', '\<', '\>', '\?', '\[', '\]', '\^', '\{', '\}', '\|', '\!', '\@', '\(', '\)', '\-', '\=', '\+', '\/', '\\', '.', '№')
            let transChars = new Array('a','b','v','g','d','e','jo','zh','z','i','j','k','l','m','n','o','p','r','s','t','u','f','h','ch','c','sh','csh','e','u','ya','y','', '', '-', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '')

            from = from.toLowerCase();

            var to = ''

            var len = from.length

            var character, isRus

            for(var i = 0; i < len; i++) {
                character = from.charAt(i,1);
                isRus = false
                for(var j=0; j < rusChars.length; j++) {
                    if(character == rusChars[j]) {
                        isRus = true
                        break
                    }
                }
                to += (isRus) ? transChars[j] : character
            }

            return to
        },
        urlFormatter(value) {
            return value.replace(/[^a-z0-9_\-.]/g, '')
        },
        strip(value, regex) {
            regex = new RegExp(regex, 'g')
            return value.replace(regex, '')
        }
    }
}
from flask import Flask
from flask import jsonify
from flask import request
import json
import executor_utils as eu

app = Flask(__name__)

@app.route('/')
def hello():
    return 'hello world'

@app.route('/buildresults', methods=['POST'])
def build_and_run():
    data  = request.get_json()
    if 'code' not in data or 'lang' not in data:
        return 'You should provide "code" and "lang"'
    
    code = data['code']
    lang = data['lang']
    # print("API got called with code %s in %s" %(code, lang))
    # return jsonify({'build': "asdf", 'run': "asdfasdfasdfasdf"})
    result = eu.build_and_run(code, lang)
    return jsonify(result)

if __name__ == '__main__':
    # import sys
    # port = int(sys.argv[1])
    # eu.load_image()
    # app.run(port=port, debug=True)
    import executor_config
    port = executor_config.PORT
    eu.load_image()
    app.run(port=port, debug=False)
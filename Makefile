test:
	node --harmony ./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- -R spec -t 20000 --require should --require co-mocha --inline-diffs

coveralls: test
	cat ./coverage/lcov.info | ./node_modules/.bin/coveralls

debug:
	node --harmony $(NODE_DEBUG) ./node_modules/.bin/_mocha -R spec -t 20000 --require should --require co-mocha

.PHONY: test

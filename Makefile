reporter = spec
test:
	@node_modules/.bin/mocha --reporter ${reporter} test/run.js

out = coverage.html

coverage: clean
	@jscoverage lib lib-cov
	@jscoverage tasks tasks-cov
	@SPM_COVERAGE=1 $(MAKE) test reporter=html-cov > ${out}
	@$(MAKE) clean
	@echo
	@echo "Built Report to ${out}"
	@echo

clean:
	@rm -f coverage.html
	@rm -fr lib-cov
	@rm -fr tasks-cov

.PHONY: test coverage

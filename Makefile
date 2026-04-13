AMETHYST_DIR := $(HOME)/Library/Application Support/Amethyst/Layouts

.PHONY: install link uninstall lint list

# Copy all layouts to Amethyst's directory (run on macOS)
install:
	@mkdir -p "$(AMETHYST_DIR)"
	@cp -v layouts/*.js "$(AMETHYST_DIR)/"
	@echo "Installed. Restart Amethyst or re-select the layout to reload."

# Symlink layouts/ contents (live editing — run on macOS)
link:
	@mkdir -p "$(AMETHYST_DIR)"
	@for f in layouts/*.js; do \
		ln -sfv "$(PWD)/$$f" "$(AMETHYST_DIR)/$$(basename $$f)"; \
	done

uninstall:
	@for f in layouts/*.js; do \
		rm -fv "$(AMETHYST_DIR)/$$(basename $$f)"; \
	done

# Quick syntax check via node
lint:
	@for f in layouts/*.js; do \
		node --check "$$f" && echo "OK $$f"; \
	done

list:
	@ls -la "$(AMETHYST_DIR)" 2>/dev/null || echo "Amethyst layouts dir not found (macOS only)."

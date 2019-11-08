default: all

.PHONY: clean
clean:
	rm -rf examples/asciigram/node_modules \
	rm -rf examples/digital-ocean/node_modules \
	rm -rf slides/dist/node_modules && \
	rm -rf slides/dist/www/* && \
	rm -rf slides/source/node_modules

.PHONY: install
install:
	. ~/.nvm/nvm.sh use 10 && \
	npm -C examples/asciigram install && \
	npm -C examples/digital-ocean install && \
	npm -C slides/dist install && \
	npm -C slides/source install && \
	cd ../..

.PHONY: asciigram
asciigram:
	pulumi -C examples/asciigram up --yes --skip-preview

.PHONY: digital-ocean
digital-ocean:
	pulumi -C examples/digital-ocean up --yes --skip-preview

.PHONY: slides
slides:
	npm -C slides/source start

.PHONY: publish
publish:
	rm -rf slides/dist/www/* && \
	npm -C slides/source run build && \
	pulumi -C slides/dist up --yes --skip-preview

.PHONY: destroy
destroy:
	pulumi -C examples/asciigram destroy -y && \
	pulumi -C examples/digital-ocean destroy -y && \
	pulumi -C slides/dist destroy -y && \
	cd ../..

.PHONY: all
all: clean install asciigram digital-ocean publish

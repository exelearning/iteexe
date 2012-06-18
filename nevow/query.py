# Copyright (c) 2004 Divmod.
# See LICENSE for details.

"""inevow.IQ adapter implementations.
"""

import warnings

from nevow import inevow, compy, stan


class QueryContext(compy.Adapter):
    __implements__ = inevow.IQ,

    def _locatePatterns(self, pattern, default, loop=True):
        if self.original.tag.pattern == pattern:
            yield self.original.tag.clone(deep=False, clearPattern=True)
        for node in stan._locatePatterns(self.original.tag, pattern, default):
            yield node

    def patternGenerator(self, pattern, default=None):
        return stan.PatternTag(self._locatePatterns(pattern, default))

    def allPatterns(self, pattern):
        if self.original.tag.pattern == pattern:
            yield self.original.tag
        for pat in self.original.tag.allPatterns(pattern):
            yield pat

    def onePattern(self, pattern):
        found = False
        try:
            found = self.original.tag.onePattern(pattern)
        except stan.NodeNotFound:
            pass
        if self.original.tag.pattern == pattern:
            if found:
                raise stan.TooManyNodes, ('pattern', pattern)
            return self.original.tag.clone(deep=False, clearPattern=True)
        if not found:
            raise stan.NodeNotFound, ('pattern', pattern)
        return found


class QueryList(compy.Adapter):
    def _locatePatterns(self, pattern, default, loop=True):
        produced = []
        for item in self.original:
            try:
                for x in inevow.IQ(item)._locatePatterns(pattern, None, loop=False):
                    produced.append(x)
                    yield x.clone(deep=False, clearPattern=True)
            except stan.NodeNotFound:
                continue

        if produced:
            while True:
                for x in produced:
                    yield x.clone(deep=False, clearPattern=True)

        if default is None:
            raise stan.NodeNotFound, ("pattern", pattern)
        if hasattr(default, 'clone'):
            while True: yield default.clone(deep=False)
        else:
            while True: yield default

    def patternGenerator(self, pattern, default=None):
        return stan.PatternTag(
            self._locatePatterns(pattern, default))

    def allPatterns(self, pattern):
        for item in self.original:
            for pat in inevow.IQ(item).allPatterns(pattern):
                yield pat

    def onePattern(self, pattern):
        found = False
        for item in self.original:
            try:
                oldFound = found
                found = inevow.IQ(item).onePattern(pattern)
                if oldFound:
                    raise stan.TooManyNodes('pattern', pattern)
            except stan.NodeNotFound:
                continue
        if not found:
            raise stan.NodeNotFound('pattern', pattern)
        return found


class QuerySlot(QueryList):
    def __init__(self, original):
        QueryList.__init__(self, original.children)


class QueryNeverFind(compy.Adapter):
    def patternGenerator(self, pattern, default=None):
        raise stan.NodeNotFound, ('pattern', pattern)

    def allPatterns(self, pattern):
        return []

    def onePattern(self, pattern):
        raise stan.NodeNotFound, ('pattern', pattern)

    def _locatePatterns(self, pattern, default, loop=True):
        return []


class QueryLoader(compy.Adapter):
    def patternGenerator(self, pattern, default=None):
        return inevow.IQ(self.original.load()).patternGenerator(pattern, default)

    def allPatterns(self, pattern):
        return inevow.IQ(self.original.load()).allPatterns(pattern)

    def onePattern(self, pattern):
        return inevow.IQ(self.original.load()).onePattern(pattern)


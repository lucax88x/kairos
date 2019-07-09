using System;
using System.Collections.Generic;

namespace Kairos.Test.Common.Infra.Mediator
{
    public class MediatorSniffer : IDisposable
    {
        private readonly List<string> _types = new List<string>();

        public void Add(string type)
        {
            _types.Add(type);
        }

        public override string ToString()
        {
            return string.Join(" -> ", _types);
        }

        public void Clear()
        {
            _types.Clear();
        }

        public void Dispose()
        {
            Clear();
        }
    }
}